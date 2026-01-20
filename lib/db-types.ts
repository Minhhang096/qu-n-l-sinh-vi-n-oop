// Database Types for University Management System
// Simplified: Single ID per entity

// ==========================================
// ENUMS
// ==========================================

export type Role = 'ADMIN' | 'DEPARTMENT' | 'TEACHER' | 'STUDENT';

export type StudentStatus = 'ACTIVE' | 'ON_LEAVE' | 'GRADUATED' | 'SUSPENDED';

export type TeacherStatus = 'ACTIVE' | 'INACTIVE';

export type SectionStatus = 'OPEN' | 'CLOSED' | 'CANCELED';

export type EnrollmentStatus = 'ENROLLED' | 'CANCELED' | 'COMPLETED';

// ==========================================
// USER AUTHENTICATION
// ==========================================

export interface UserAccount {
    id: string;
    username: string;
    passwordHash: string;
    role: Role;
    isLocked: boolean;
    fullName: string;
    email: string;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ==========================================
// ORGANIZATIONAL ENTITIES
// ==========================================

export interface Department {
    id: string; // Department code (e.g., "CS")
    name: string;
    headId?: string;
    phone?: string;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClassGroup {
    id: string; // Class code (e.g., "CS2024A")
    name: string;
    cohort: number;
    departmentId: string;
    createdAt: Date;
    updatedAt: Date;
}

// ==========================================
// PERSON ENTITIES
// ==========================================

export interface Student {
    id: string; // Student ID code (e.g., "2024001")
    userId: string;
    fullName: string;
    dateOfBirth?: Date;
    email: string;
    phone?: string;
    classId: string;
    departmentId: string;
    status: StudentStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface Teacher {
    id: string; // Teacher ID code (e.g., "T001")
    userId: string;
    fullName: string;
    email: string;
    phone?: string;
    departmentId: string;
    status: TeacherStatus;
    createdAt: Date;
    updatedAt: Date;
}

// ==========================================
// ACADEMIC ENTITIES
// ==========================================

export interface Course {
    id: string; // Course code (e.g., "CS101")
    name: string;
    credits: number;
    description?: string;
    level?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CourseSection {
    id: string;
    sectionNumber: string;
    courseId: string;
    teacherId: string;
    term: string;
    capacity: number;
    enrolledCount: number;
    status: SectionStatus;
    isScoreLocked: boolean;
    schedule?: string;
    room?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ==========================================
// ENROLLMENT & GRADING
// ==========================================

export interface Enrollment {
    id: string;
    studentId: string;
    sectionId: string;
    enrollDate: Date;
    status: EnrollmentStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface Score {
    id: string;
    enrollmentId: string;
    processScore?: number;
    finalScore?: number;
    totalScore?: number;
    letterGrade?: string;
    updatedAt: Date;
    updatedBy?: string;
}

export interface Transcript {
    id: string;
    studentId: string;
    term: string;
    gpa: number;
    totalCredits: number;
    cumulativeGpa?: number;
    generatedAt: Date;
}

// ==========================================
// EXTENDED TYPES (with relations)
// ==========================================

export interface StudentWithRelations extends Student {
    user?: UserAccount;
    class?: ClassGroup;
    department?: Department;
    enrollments?: EnrollmentWithRelations[];
}

export interface TeacherWithRelations extends Teacher {
    user?: UserAccount;
    department?: Department;
    sections?: CourseSectionWithRelations[];
}

export interface CourseSectionWithRelations extends CourseSection {
    course?: Course;
    teacher?: Teacher;
    enrollments?: EnrollmentWithRelations[];
}

export interface EnrollmentWithRelations extends Enrollment {
    student?: Student;
    section?: CourseSectionWithRelations;
    score?: Score;
}
