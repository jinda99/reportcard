import { PrismaClient, Role, SchoolStatus, BillingCycle, SubscriptionStatus, Gender, ParentRelationship, ScoreStatus, PublicationStatus, ScaleType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  DEFAULT_WAEC_GRADE_BANDS,
  DEFAULT_CA_COMPONENTS,
  DEFAULT_EXAM_MAX,
  computeStudentScore,
  computeSubjectPositions,
  computeClassTermResults,
} from '../lib/grading/engine';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ReportCard database...');

  // 1. Password hash for all demo users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Platform Admin
  const platformAdminUser = await prisma.user.upsert({
    where: { email: 'platform@reportcard.ng' },
    update: {},
    create: {
      email: 'platform@reportcard.ng',
      fullName: 'Super Administrator',
      passwordHash,
      isActive: true,
      platformAdmin: {
        create: {},
      },
    },
  });
  console.log('Created Platform Admin:', platformAdminUser.email);

  // 3. Subscription Plans
  const termlyPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'plan-termly-standard' },
    update: {},
    create: {
      id: 'plan-termly-standard',
      name: 'Standard Termly',
      priceNgn: 50000,
      billingCycle: BillingCycle.TERMLY,
      learnerLimit: 500,
      isActive: true,
    },
  });

  const annualPlan = await prisma.subscriptionPlan.upsert({
    where: { id: 'plan-annual-premium' },
    update: {},
    create: {
      id: 'plan-annual-premium',
      name: 'Annual Premium',
      priceNgn: 135000,
      billingCycle: BillingCycle.ANNUAL,
      learnerLimit: 2000,
      isActive: true,
    },
  });

  // 4. Demo School: Grace Heritage College
  const school = await prisma.school.upsert({
    where: { slug: 'grace-heritage' },
    update: {},
    create: {
      name: 'Grace Heritage College',
      slug: 'grace-heritage',
      primaryColor: '#16a34a',
      address: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos State',
      phone: '+234 802 345 6789',
      email: 'info@graceheritage.edu.ng',
      status: SchoolStatus.ACTIVE,
      subscriptionPlanId: annualPlan.id,
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      subscriptions: {
        create: {
          planId: annualPlan.id,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });
  console.log('Created School:', school.name);

  // 5. School Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@graceheritage.edu.ng' },
    update: {},
    create: {
      email: 'admin@graceheritage.edu.ng',
      fullName: 'Mrs. Folashade Adeleke',
      passwordHash,
      isActive: true,
      memberships: {
        create: {
          schoolId: school.id,
          role: Role.SCHOOL_ADMIN,
        },
      },
    },
  });
  console.log('Created School Admin:', adminUser.email);

  // 6. Grading Scheme (WAEC Standard)
  const gradingScheme = await prisma.gradingScheme.create({
    data: {
      schoolId: school.id,
      name: 'Standard WAEC Scheme',
      scaleType: ScaleType.WAEC_9POINT,
      caComponents: DEFAULT_CA_COMPONENTS as any,
      examMax: DEFAULT_EXAM_MAX,
      gradeBands: DEFAULT_WAEC_GRADE_BANDS as any,
    },
  });

  // 7. Academic Session & Terms
  const session = await prisma.academicSession.create({
    data: {
      schoolId: school.id,
      name: '2024/2025',
      startDate: new Date('2024-09-09'),
      endDate: new Date('2025-07-20'),
      isCurrent: true,
      terms: {
        create: [
          {
            schoolId: school.id,
            name: 'First Term',
            sequence: 1,
            startDate: new Date('2024-09-09'),
            endDate: new Date('2024-12-15'),
            isCurrent: true,
            gradingSchemeId: gradingScheme.id,
          },
          {
            schoolId: school.id,
            name: 'Second Term',
            sequence: 2,
            startDate: new Date('2025-01-08'),
            endDate: new Date('2025-04-10'),
            isCurrent: false,
            gradingSchemeId: gradingScheme.id,
          },
          {
            schoolId: school.id,
            name: 'Third Term',
            sequence: 3,
            startDate: new Date('2025-04-28'),
            endDate: new Date('2025-07-20'),
            isCurrent: false,
            gradingSchemeId: gradingScheme.id,
          },
        ],
      },
    },
    include: { terms: true },
  });

  const firstTerm = session.terms.find(t => t.sequence === 1)!;

  // 8. Class Levels & Classes
  const jss1Level = await prisma.classLevel.create({
    data: { schoolId: school.id, name: 'JSS 1', order: 1 },
  });
  await prisma.classLevel.create({ data: { schoolId: school.id, name: 'JSS 2', order: 2 } });
  await prisma.classLevel.create({ data: { schoolId: school.id, name: 'JSS 3', order: 3 } });

  const classJSS1A = await prisma.class.create({
    data: {
      schoolId: school.id,
      classLevelId: jss1Level.id,
      name: 'JSS 1A',
    },
  });

  // 9. Subjects
  const subMath = await prisma.subject.create({
    data: { schoolId: school.id, name: 'Mathematics', code: 'MTH' },
  });
  const subEng = await prisma.subject.create({
    data: { schoolId: school.id, name: 'English Language', code: 'ENG' },
  });
  const subSci = await prisma.subject.create({
    data: { schoolId: school.id, name: 'Basic Science', code: 'BSC' },
  });

  // 10. ClassSubjects
  const csMath = await prisma.classSubject.create({
    data: { schoolId: school.id, classId: classJSS1A.id, subjectId: subMath.id },
  });
  const csEng = await prisma.classSubject.create({
    data: { schoolId: school.id, classId: classJSS1A.id, subjectId: subEng.id },
  });
  const csSci = await prisma.classSubject.create({
    data: { schoolId: school.id, classId: classJSS1A.id, subjectId: subSci.id },
  });

  // 11. Teacher User & Assignments
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@graceheritage.edu.ng' },
    update: {},
    create: {
      email: 'teacher@graceheritage.edu.ng',
      fullName: 'Mr. Babatunde Adebayo',
      passwordHash,
      isActive: true,
      memberships: {
        create: {
          schoolId: school.id,
          role: Role.TEACHER,
        },
      },
      teacherAssignments: {
        create: [
          { schoolId: school.id, classSubjectId: csMath.id },
          { schoolId: school.id, classSubjectId: csEng.id },
        ],
      },
    },
  });
  console.log('Created Teacher:', teacherUser.email);

  // 12. Students
  const student1 = await prisma.student.create({
    data: {
      schoolId: school.id,
      classId: classJSS1A.id,
      admissionNo: 'GHC/2024/001',
      firstName: 'Emeka',
      lastName: 'Okafor',
      middleName: 'David',
      gender: Gender.MALE,
      dateOfBirth: new Date('2012-05-14'),
    },
  });

  const student2 = await prisma.student.create({
    data: {
      schoolId: school.id,
      classId: classJSS1A.id,
      admissionNo: 'GHC/2024/002',
      firstName: 'Amina',
      lastName: 'Bello',
      middleName: 'Fatima',
      gender: Gender.FEMALE,
      dateOfBirth: new Date('2012-08-22'),
    },
  });

  const student3 = await prisma.student.create({
    data: {
      schoolId: school.id,
      classId: classJSS1A.id,
      admissionNo: 'GHC/2024/003',
      firstName: 'Chukwudi',
      lastName: 'Eze',
      gender: Gender.MALE,
      dateOfBirth: new Date('2012-02-10'),
    },
  });

  const student4 = await prisma.student.create({
    data: {
      schoolId: school.id,
      classId: classJSS1A.id,
      admissionNo: 'GHC/2024/004',
      firstName: 'Zainab',
      lastName: 'Usman',
      gender: Gender.FEMALE,
      dateOfBirth: new Date('2012-11-30'),
    },
  });

  // 13. Parent User & Linking
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent.okafor@gmail.com' },
    update: {},
    create: {
      email: 'parent.okafor@gmail.com',
      fullName: 'Chief Dr. Chidi Okafor',
      phone: '+234 803 999 1122',
      passwordHash,
      isActive: true,
      parentStudents: {
        create: {
          schoolId: school.id,
          studentId: student1.id,
          relationship: ParentRelationship.FATHER,
        },
      },
    },
  });
  console.log('Created Parent:', parentUser.email, 'linked to Emeka Okafor');

  // 14. Compute and Insert ScoreRecords
  const schemeConfig = {
    scaleType: 'WAEC_9POINT' as const,
    caComponents: DEFAULT_CA_COMPONENTS,
    examMax: DEFAULT_EXAM_MAX,
    gradeBands: DEFAULT_WAEC_GRADE_BANDS,
  };

  // Math raw scores
  const mathInputs = [
    { studentId: student1.id, caScores: { test1: 9, test2: 8, assignment: 18 }, examScore: 54 }, // Total 89
    { studentId: student2.id, caScores: { test1: 10, test2: 9, assignment: 19 }, examScore: 56 }, // Total 94
    { studentId: student3.id, caScores: { test1: 7, test2: 7, assignment: 15 }, examScore: 45 }, // Total 74
    { studentId: student4.id, caScores: { test1: 8, test2: 6, assignment: 14 }, examScore: 38 }, // Total 66
  ];

  const computedMath = computeSubjectPositions(
    mathInputs.map(input => computeStudentScore(input, schemeConfig))
  );

  for (const record of computedMath) {
    const raw = mathInputs.find(m => m.studentId === record.studentId)!;
    await prisma.scoreRecord.create({
      data: {
        schoolId: school.id,
        termId: firstTerm.id,
        classSubjectId: csMath.id,
        studentId: record.studentId,
        caScores: raw.caScores as any,
        examScore: record.examScore,
        totalScore: record.totalScore,
        grade: record.grade,
        subjectPosition: record.subjectPosition,
        status: ScoreStatus.APPROVED,
        submittedAt: new Date(),
        approvedAt: new Date(),
        submittedByUserId: teacherUser.id,
        approvedByUserId: adminUser.id,
      },
    });
  }

  // English raw scores
  const engInputs = [
    { studentId: student1.id, caScores: { test1: 8, test2: 9, assignment: 17 }, examScore: 52 }, // Total 86
    { studentId: student2.id, caScores: { test1: 9, test2: 9, assignment: 18 }, examScore: 50 }, // Total 86
    { studentId: student3.id, caScores: { test1: 6, test2: 7, assignment: 13 }, examScore: 42 }, // Total 68
    { studentId: student4.id, caScores: { test1: 7, test2: 8, assignment: 16 }, examScore: 44 }, // Total 75
  ];

  const computedEng = computeSubjectPositions(
    engInputs.map(input => computeStudentScore(input, schemeConfig))
  );

  for (const record of computedEng) {
    const raw = engInputs.find(e => e.studentId === record.studentId)!;
    await prisma.scoreRecord.create({
      data: {
        schoolId: school.id,
        termId: firstTerm.id,
        classSubjectId: csEng.id,
        studentId: record.studentId,
        caScores: raw.caScores as any,
        examScore: record.examScore,
        totalScore: record.totalScore,
        grade: record.grade,
        subjectPosition: record.subjectPosition,
        status: ScoreStatus.APPROVED,
        submittedAt: new Date(),
        approvedAt: new Date(),
        submittedByUserId: teacherUser.id,
        approvedByUserId: adminUser.id,
      },
    });
  }

  // 15. Compute Class Term Results
  const studentScoresMap = new Map();
  studentScoresMap.set(student1.id, [
    computedMath.find(r => r.studentId === student1.id)!,
    computedEng.find(r => r.studentId === student1.id)!,
  ]);
  studentScoresMap.set(student2.id, [
    computedMath.find(r => r.studentId === student2.id)!,
    computedEng.find(r => r.studentId === student2.id)!,
  ]);
  studentScoresMap.set(student3.id, [
    computedMath.find(r => r.studentId === student3.id)!,
    computedEng.find(r => r.studentId === student3.id)!,
  ]);
  studentScoresMap.set(student4.id, [
    computedMath.find(r => r.studentId === student4.id)!,
    computedEng.find(r => r.studentId === student4.id)!,
  ]);

  const classResults = computeClassTermResults(classJSS1A.id, firstTerm.id, studentScoresMap);

  for (const res of classResults) {
    await prisma.termResult.create({
      data: {
        schoolId: school.id,
        termId: firstTerm.id,
        studentId: res.studentId,
        classId: classJSS1A.id,
        totalScore: res.totalScore ?? 0,
        average: res.average ?? 0,
        subjectsCount: res.subjectsCount,
        positionInClass: res.positionInClass ?? 1,
        classSize: res.classSize,
        attendanceDaysOpen: 110,
        attendanceDaysPresent: res.studentId === student1.id ? 108 : 105,
        classTeacherComment:
          res.positionInClass === 1
            ? 'An exceptional, brilliant performance! Keep it up.'
            : 'Very hardworking and dedicated student. Well done.',
        headTeacherComment: 'Promising academic term. Commended for high diligence.',
        publishedAt: new Date(),
      },
    });
  }

  // 16. Result Publication Status
  await prisma.resultPublication.create({
    data: {
      schoolId: school.id,
      termId: firstTerm.id,
      classId: classJSS1A.id,
      status: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
      publishedByUserId: adminUser.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
