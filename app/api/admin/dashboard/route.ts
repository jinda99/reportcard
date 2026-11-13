import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || (user.role !== 'SCHOOL_ADMIN' && user.role !== 'PLATFORM_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schoolId = user.schoolId;

    if (!schoolId) {
      // Return high-fidelity fallback for demo session
      return NextResponse.json({
        schoolName: 'Bright Future College',
        learnerCount: 40,
        classesCount: 3,
        teachersCount: 4,
        sessionName: '2024/2025',
        currentTermName: 'First Term',
        subscription: {
          status: 'ACTIVE',
          daysLeft: 284,
        },
        onboarding: {
          branding: true,
          sessionTerms: true,
          gradingScheme: true,
          classesSubjects: true,
          studentsImported: true,
          teachersInvited: true,
          teacherAssignments: true,
        },
        resultsQueue: [
          {
            classId: 'cls_jss1a',
            className: 'JSS 1A',
            termId: 'trm_first',
            termName: 'First Term',
            status: 'PUBLISHED',
            submittedSubjects: 8,
            totalSubjects: 8,
          },
        ],
      });
    }

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        academicSessions: { where: { isCurrent: true }, include: { terms: true } },
        classes: true,
        teacherAssignments: true,
        subscriptions: { where: { status: 'ACTIVE' }, take: 1 },
      },
    });

    const learnerCount = await prisma.student.count({ where: { schoolId, isActive: true } });

    return NextResponse.json({
      schoolName: school?.name || 'School Admin Console',
      learnerCount,
      classesCount: school?.classes.length || 0,
      teachersCount: school?.teacherAssignments.length || 0,
      sessionName: school?.academicSessions[0]?.name || '2024/2025',
      currentTermName: school?.academicSessions[0]?.terms.find(t => t.isCurrent)?.name || 'First Term',
      subscription: {
        status: school?.subscriptions[0]?.status || 'TRIALING',
        daysLeft: 14,
      },
      onboarding: {
        branding: !!school?.primaryColor,
        sessionTerms: (school?.academicSessions.length || 0) > 0,
        gradingScheme: true,
        classesSubjects: (school?.classes.length || 0) > 0,
        studentsImported: learnerCount > 0,
        teachersInvited: true,
        teacherAssignments: (school?.teacherAssignments.length || 0) > 0,
      },
      resultsQueue: [
        {
          classId: 'cls_jss1a',
          className: 'JSS 1A',
          termId: 'trm_first',
          termName: 'First Term',
          status: 'PUBLISHED',
          submittedSubjects: 8,
          totalSubjects: 8,
        },
      ],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
