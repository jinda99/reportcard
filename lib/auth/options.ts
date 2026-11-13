import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';

// Seeded fallback users matching Section 14 for zero-downtime offline demoability
const DEMO_USERS = [
  {
    id: 'usr_platform_admin',
    email: 'platform@reportcard.ng',
    name: 'Super Administrator',
    role: 'PLATFORM_ADMIN',
    schoolId: null,
    schoolName: null,
    membershipId: null,
  },
  {
    id: 'usr_school_admin',
    email: 'admin@brightfuture.edu.ng',
    name: 'Dr. Mrs. Bola Tinubu-Kuti',
    role: 'SCHOOL_ADMIN',
    schoolId: 'school_bright_future',
    schoolName: 'Bright Future College',
    membershipId: 'mem_school_admin_1',
  },
  {
    id: 'usr_teacher_adeyemi',
    email: 'teacher.adeyemi@brightfuture.edu.ng',
    name: 'Mr. Babatunde Adeyemi',
    role: 'TEACHER',
    schoolId: 'school_bright_future',
    schoolName: 'Bright Future College',
    membershipId: 'mem_teacher_1',
  },
  {
    id: 'usr_parent_okafor',
    email: 'parent.okafor@gmail.com',
    name: 'Chief Dr. Chidi Okafor',
    role: 'PARENT',
    schoolId: 'school_bright_future',
    schoolName: 'Bright Future College',
    membershipId: null,
  },
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        const email = credentials.email.trim().toLowerCase();

        // 1. First attempt database query via Prisma
        try {
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              platformAdmin: true,
              memberships: {
                include: { school: true },
              },
              parentStudents: {
                include: { school: true },
              },
            },
          });

          if (user && user.isActive) {
            const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
            if (isValid) {
              let role = 'PARENT';
              let schoolId: string | null = null;
              let schoolName: string | null = null;
              let membershipId: string | null = null;

              if (user.platformAdmin) {
                role = 'PLATFORM_ADMIN';
              } else if (user.memberships.length > 0) {
                const membership = user.memberships[0];
                role = membership.role;
                schoolId = membership.schoolId;
                schoolName = membership.school.name;
                membershipId = membership.id;
              } else if (user.parentStudents.length > 0) {
                role = 'PARENT';
                schoolId = user.parentStudents[0].schoolId;
                schoolName = user.parentStudents[0].school.name;
              }

              return {
                id: user.id,
                email: user.email,
                name: user.fullName,
                role,
                schoolId,
                schoolName,
                membershipId,
              };
            }
          }
        } catch (dbError) {
          // Fall back gracefully if database connection is pending configuration
          console.warn('Prisma lookup failed, checking seeded demo registry:', dbError instanceof Error ? dbError.message : 'DB connection');
        }

        // 2. Demo fallback credentials (Section 14)
        const demoUser = DEMO_USERS.find(u => u.email === email);
        if (demoUser && credentials.password === 'Password123!') {
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
            schoolId: demoUser.schoolId,
            schoolName: demoUser.schoolName,
            membershipId: demoUser.membershipId,
          };
        }

        throw new Error('Invalid email or password');
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.schoolId = (user as any).schoolId;
        token.schoolName = (user as any).schoolName;
        token.membershipId = (user as any).membershipId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).schoolId = token.schoolId as string | null;
        (session.user as any).schoolName = token.schoolName as string | null;
        (session.user as any).membershipId = token.membershipId as string | null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-super-secret-reportcard-portal-jwt-secret-key-32chars',
};
