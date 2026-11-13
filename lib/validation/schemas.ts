import { z } from 'zod';

export const registerSchoolSchema = z.object({
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
  adminFullName: z.string().min(2, 'Admin full name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const sessionTermSchema = z.object({
  sessionName: z.string().min(4, 'e.g. 2025/2026'),
  sessionStartDate: z.string().min(1, 'Start date is required'),
  sessionEndDate: z.string().min(1, 'End date is required'),
  terms: z.array(
    z.object({
      name: z.string().min(1),
      sequence: z.number().int().min(1).max(3),
      startDate: z.string().min(1),
      endDate: z.string().min(1),
      isCurrent: z.boolean().default(false),
    })
  ),
});

export const gradingSchemeSchema = z.object({
  name: z.string().min(2, 'Scheme name is required'),
  scaleType: z.enum(['WAEC_9POINT', 'LETTER_AF', 'CUSTOM']),
  caComponents: z.array(
    z.object({
      key: z.string().min(1),
      label: z.string().min(1),
      max: z.number().min(1).max(100),
    })
  ),
  examMax: z.number().min(0).max(100),
  gradeBands: z.array(
    z.object({
      min: z.number().min(0).max(100),
      max: z.number().min(0).max(100),
      grade: z.string().min(1),
      remark: z.string().min(1),
      points: z.number().optional(),
    })
  ),
}).refine(
  data => {
    const caSum = data.caComponents.reduce((sum, c) => sum + c.max, 0);
    return caSum + data.examMax === 100;
  },
  {
    message: 'The sum of all CA component maximums and exam maximum must equal 100',
    path: ['examMax'],
  }
);

export const scoreEntryRowSchema = z.object({
  studentId: z.string().min(1),
  caScores: z.record(z.string(), z.number().nullable().optional()),
  examScore: z.number().min(0).max(100).nullable().optional(),
});

export const scoreBatchUpdateSchema = z.object({
  classSubjectId: z.string().min(1),
  termId: z.string().min(1),
  scores: z.array(scoreEntryRowSchema),
  submit: z.boolean().default(false),
});

export const studentCsvRowSchema = z.object({
  admissionNo: z.string().min(1, 'Admission number is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  className: z.string().min(1, 'Class name is required (e.g. JSS 1A)'),
  parentEmail: z.string().email().optional().or(z.literal('')),
  parentFullName: z.string().optional(),
  parentRelationship: z.enum(['FATHER', 'MOTHER', 'GUARDIAN']).default('GUARDIAN'),
});

export const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['SCHOOL_ADMIN', 'TEACHER']),
  fullName: z.string().optional(),
});
