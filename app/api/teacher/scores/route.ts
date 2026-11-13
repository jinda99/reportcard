import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { scoreBatchUpdateSchema } from '@/lib/validation/schemas';
import { ScoreStatus } from '@prisma/client';

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || (user.role !== 'TEACHER' && user.role !== 'SCHOOL_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized score update' }, { status: 401 });
    }

    const body = await req.json();
    const validated = scoreBatchUpdateSchema.parse(body);

    const schoolId = user.schoolId;
    if (!schoolId) {
      return NextResponse.json({ error: 'Tenant context missing' }, { status: 400 });
    }

    // Hard Rule: Verify teacher assignment
    if (user.role === 'TEACHER') {
      const assignment = await prisma.teacherAssignment.findFirst({
        where: {
          teacherUserId: user.id,
          classSubjectId: validated.classSubjectId,
        },
      });

      if (!assignment) {
        return NextResponse.json(
          { error: 'Forbidden: You are not assigned to teach this class-subject' },
          { status: 403 }
        );
      }
    }

    // Perform batch score updates
    const updatedCount = validated.scores.length;

    for (const item of validated.scores) {
      const existing = await prisma.scoreRecord.findUnique({
        where: {
          termId_classSubjectId_studentId: {
            termId: validated.termId,
            classSubjectId: validated.classSubjectId,
            studentId: item.studentId,
          },
        },
      });

      // If record is already SUBMITTED or APPROVED and user is not admin, block edit
      if (existing && existing.status !== ScoreStatus.DRAFT && user.role === 'TEACHER') {
        continue;
      }

      await prisma.scoreRecord.upsert({
        where: {
          termId_classSubjectId_studentId: {
            termId: validated.termId,
            classSubjectId: validated.classSubjectId,
            studentId: item.studentId,
          },
        },
        update: {
          caScores: item.caScores as any,
          examScore: item.examScore,
          status: validated.submit ? ScoreStatus.SUBMITTED : ScoreStatus.DRAFT,
          submittedAt: validated.submit ? new Date() : existing?.submittedAt,
          submittedByUserId: validated.submit ? user.id : existing?.submittedByUserId,
        },
        create: {
          schoolId,
          termId: validated.termId,
          classSubjectId: validated.classSubjectId,
          studentId: item.studentId,
          caScores: item.caScores as any,
          examScore: item.examScore,
          status: validated.submit ? ScoreStatus.SUBMITTED : ScoreStatus.DRAFT,
          submittedAt: validated.submit ? new Date() : undefined,
          submittedByUserId: validated.submit ? user.id : undefined,
        },
      });

      // Audit log on score changes (Section 5)
      if (existing && existing.status !== ScoreStatus.DRAFT) {
        await prisma.auditLog.create({
          data: {
            schoolId,
            actorUserId: user.id,
            action: 'SCORE_MUTATION_AFTER_SUBMISSION',
            entityType: 'ScoreRecord',
            entityId: existing.id,
            before: { caScores: existing.caScores, examScore: existing.examScore },
            after: { caScores: item.caScores, examScore: item.examScore },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      status: validated.submit ? 'SUBMITTED' : 'DRAFT',
    });
  } catch (err: any) {
    console.error('Scores API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update score records' },
      { status: 400 }
    );
  }
}
