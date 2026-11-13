import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { registerSchoolSchema } from '@/lib/validation/schemas';
import { SchoolStatus, SubscriptionStatus, Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchoolSchema.parse(body);

    const email = validated.email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    // Generate unique slug for school
    const baseSlug = validated.schoolName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const passwordHash = await bcrypt.hash(validated.password, 10);

    // Create user and school in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          fullName: validated.adminFullName,
          passwordHash,
          phone: validated.phone,
          isActive: true,
        },
      });

      const school = await tx.school.create({
        data: {
          name: validated.schoolName,
          slug,
          status: SchoolStatus.PENDING,
          phone: validated.phone,
          email: validated.email,
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
        },
      });

      // Assign Membership as SCHOOL_ADMIN
      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          schoolId: school.id,
          role: Role.SCHOOL_ADMIN,
        },
      });

      return { user, school, membership };
    });

    return NextResponse.json(
      {
        success: true,
        schoolId: result.school.id,
        schoolName: result.school.name,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: err?.errors?.[0]?.message || err?.message || 'Failed to register school.' },
      { status: 400 }
    );
  }
}
