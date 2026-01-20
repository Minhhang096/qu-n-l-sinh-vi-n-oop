// Type definitions for University Management System

// ============================================
// Role & Authentication Types
// ============================================

export type UserRole = 'Student' | 'Teacher' | 'Department' | 'Admin';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    roleId: number;
    profile: StudentProfile | StaffProfile | null;
    createdAt: string;
    updatedAt: string;
}

export interface Role {
    id: number;
    name: UserRole;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    role: UserRole;
    profile: Partial<StudentProfile | StaffProfile>;
}

// ============================================
// Profile Types
// ============================================

export interface StudentProfile {
    userId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gpa: number;
    major: string;
    enrollmentYear: number;
    avatarUrl?: string;
}

export interface StaffProfile {
    userId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    department: string;
    hireDate: string;
    officeLocation: string;
    avatarUrl?: string;
}

// ============================================
// Academic Types
// ============================================

export interface Course {
    id: string;
    name: string;
    code: string;
    description: string;
    credits: number;
    semester: string;
    capacity: number;
    enrolledCount: number;
    status: 'active' | 'archived' | 'draft';
    createdAt: string;
    updatedAt: string;
}

export interface CourseAssignment {
    id: string;
    courseId: string;
    teacherId: string;
    course?: Course;
    teacher?: User;
}

export interface Enrollment {
    id: string;
    courseId: string;
    studentId: string;
    grade: string | null;
    status: 'enrolled' | 'completed' | 'dropped';
    enrolledAt: string;
    course?: Course;
    student?: User;
}

export interface Assignment {
    id: string;
    courseId: string;
    title: string;
    description: string;
    dueDate: string;
    maxPoints: number;
    status: 'draft' | 'published' | 'closed';
    createdAt: string;
    updatedAt: string;
    course?: Course;
}

export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    content: string;
    submittedAt: string;
    grade: number | null;
    feedback: string | null;
    assignment?: Assignment;
    student?: User;
}

// ============================================
// Navigation Types
// ============================================

export interface NavItem {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string;
    children?: NavItem[];
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================
// Dashboard Stats Types
// ============================================

export interface DashboardStats {
    totalStudents?: number;
    totalTeachers?: number;
    totalCourses?: number;
    totalEnrollments?: number;
    activeAssignments?: number;
    pendingSubmissions?: number;
    averageGpa?: number;
}

export interface ChartDataPoint {
    name: string;
    value: number;
    fill?: string;
}

// ============================================
// Form Types
// ============================================

export interface CourseFormData {
    name: string;
    code: string;
    description: string;
    credits: number;
    semester: string;
    capacity: number;
}

export interface AssignmentFormData {
    title: string;
    description: string;
    courseId: string;
    dueDate: string;
    maxPoints: number;
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    read: boolean;
    createdAt: string;
}
