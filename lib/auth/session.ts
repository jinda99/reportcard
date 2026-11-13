import { getServerSession } from 'next-auth';
import { authOptions } from './options';
import { redirect } from 'next/navigation';

export interface CurrentSessionUser {
  id: string;
  email: string;
  name: string;
  role: 'PLATFORM_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT';
  schoolId: string | null;
  schoolName: string | null;
  membershipId: string | null;
}

export async function getCurrentUser(): Promise<CurrentSessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as unknown as CurrentSessionUser;
}

export async function requireAuth(): Promise<CurrentSessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireRole(allowedRoles: Array<'PLATFORM_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT'>): Promise<CurrentSessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect('/login?error=Unauthorized');
  }
  return user;
}

export async function requireSchoolAdmin(): Promise<CurrentSessionUser & { schoolId: string }> {
  const user = await requireRole(['SCHOOL_ADMIN', 'PLATFORM_ADMIN']);
  if (!user.schoolId && user.role !== 'PLATFORM_ADMIN') {
    redirect('/login?error=NoSchoolAssigned');
  }
  return user as CurrentSessionUser & { schoolId: string };
}

export async function requireTeacher(): Promise<CurrentSessionUser & { schoolId: string }> {
  const user = await requireRole(['TEACHER']);
  if (!user.schoolId) {
    redirect('/login?error=NoSchoolAssigned');
  }
  return user as CurrentSessionUser & { schoolId: string };
}

export async function requireParent(): Promise<CurrentSessionUser> {
  return await requireRole(['PARENT']);
}
