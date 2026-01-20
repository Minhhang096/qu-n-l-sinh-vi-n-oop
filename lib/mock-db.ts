// Mock Database for Development
// Simplified: Single ID per entity

import type {
    UserAccount,
    Student,
    Teacher,
    Department,
    ClassGroup,
    Course,
    CourseSection,
    Enrollment,
    Score,
} from './db-types';

// ==========================================
// DEPARTMENTS (id = code)
// ==========================================

export const departments: Department[] = [
    { id: 'CS', name: 'Computer Science', headId: 'T001', phone: '+1 555-0101', location: 'Science Building, 3rd Floor', createdAt: new Date('2020-01-01'), updatedAt: new Date() },
    { id: 'MATH', name: 'Mathematics', headId: 'T002', phone: '+1 555-0102', location: 'Math Hall, 2nd Floor', createdAt: new Date('2020-01-01'), updatedAt: new Date() },
    { id: 'PHYS', name: 'Physics', phone: '+1 555-0103', location: 'Science Building, 5th Floor', createdAt: new Date('2020-01-01'), updatedAt: new Date() },
    { id: 'ENG', name: 'English Literature', phone: '+1 555-0104', location: 'Humanities Building', createdAt: new Date('2020-01-01'), updatedAt: new Date() },
    { id: 'BIO', name: 'Biology', phone: '+1 555-0105', location: 'Life Sciences Building', createdAt: new Date('2020-01-01'), updatedAt: new Date() },
];

// ==========================================
// CLASS GROUPS (id = code)
// ==========================================

export const classGroups: ClassGroup[] = [
    { id: 'CS2024A', name: 'Computer Science 2024 - Section A', cohort: 2024, departmentId: 'CS', createdAt: new Date(), updatedAt: new Date() },
    { id: 'CS2024B', name: 'Computer Science 2024 - Section B', cohort: 2024, departmentId: 'CS', createdAt: new Date(), updatedAt: new Date() },
    { id: 'MATH2024', name: 'Mathematics 2024', cohort: 2024, departmentId: 'MATH', createdAt: new Date(), updatedAt: new Date() },
    { id: 'PHYS2023', name: 'Physics 2023', cohort: 2023, departmentId: 'PHYS', createdAt: new Date(), updatedAt: new Date() },
];

// ==========================================
// USER ACCOUNTS
// ==========================================

export const userAccounts: UserAccount[] = [
    { id: 'U001', username: 'admin', passwordHash: 'admin123', role: 'ADMIN', isLocked: false, fullName: 'System Administrator', email: 'admin@univ.edu', createdAt: new Date('2020-01-01'), updatedAt: new Date() },
    { id: 'U002', username: 'department', passwordHash: 'department123', role: 'DEPARTMENT', isLocked: false, fullName: 'Emily Davis', email: 'department@univ.edu', createdAt: new Date('2020-01-01'), updatedAt: new Date() },
    { id: 'U003', username: 'turing', passwordHash: 'teacher123', role: 'TEACHER', isLocked: false, fullName: 'Dr. Alan Turing', email: 'a.turing@univ.edu', createdAt: new Date('2019-08-01'), updatedAt: new Date() },
    { id: 'U004', username: 'johnson', passwordHash: 'teacher123', role: 'TEACHER', isLocked: false, fullName: 'Dr. Katherine Johnson', email: 'k.johnson@univ.edu', createdAt: new Date('2019-08-01'), updatedAt: new Date() },
    { id: 'U005', username: 'hopper', passwordHash: 'teacher123', role: 'TEACHER', isLocked: false, fullName: 'Dr. Grace Hopper', email: 'g.hopper@univ.edu', createdAt: new Date('2019-08-01'), updatedAt: new Date() },
    { id: 'U006', username: 'alice', passwordHash: 'student123', role: 'STUDENT', isLocked: false, fullName: 'Alice Weaver', email: 'alice.w@univ.edu', createdAt: new Date('2024-09-01'), updatedAt: new Date() },
    { id: 'U007', username: 'bob', passwordHash: 'student123', role: 'STUDENT', isLocked: false, fullName: 'Bob Miller', email: 'bob.m@univ.edu', createdAt: new Date('2024-09-01'), updatedAt: new Date() },
    { id: 'U008', username: 'charlie', passwordHash: 'student123', role: 'STUDENT', isLocked: false, fullName: 'Charlie Brown', email: 'charlie.b@univ.edu', createdAt: new Date('2023-09-01'), updatedAt: new Date() },
];

// ==========================================
// TEACHERS (id = teacher code)
// ==========================================

export const teachers: Teacher[] = [
    { id: 'T001', userId: 'U003', fullName: 'Dr. Alan Turing', email: 'a.turing@univ.edu', phone: '+1 555-1001', departmentId: 'CS', status: 'ACTIVE', createdAt: new Date('2019-08-01'), updatedAt: new Date() },
    { id: 'T002', userId: 'U004', fullName: 'Dr. Katherine Johnson', email: 'k.johnson@univ.edu', phone: '+1 555-1002', departmentId: 'MATH', status: 'ACTIVE', createdAt: new Date('2019-08-01'), updatedAt: new Date() },
    { id: 'T003', userId: 'U005', fullName: 'Dr. Grace Hopper', email: 'g.hopper@univ.edu', phone: '+1 555-1003', departmentId: 'CS', status: 'ACTIVE', createdAt: new Date('2019-08-01'), updatedAt: new Date() },
];

// ==========================================
// STUDENTS (id = student code)
// ==========================================

export const students: Student[] = [
    { id: '2024001', userId: 'U006', fullName: 'Alice Weaver', email: 'alice.w@univ.edu', dateOfBirth: new Date('2004-05-15'), phone: '+1 555-2001', classId: 'CS2024A', departmentId: 'CS', status: 'ACTIVE', createdAt: new Date('2024-09-01'), updatedAt: new Date() },
    { id: '2024002', userId: 'U007', fullName: 'Bob Miller', email: 'bob.m@univ.edu', dateOfBirth: new Date('2004-08-22'), phone: '+1 555-2002', classId: 'MATH2024', departmentId: 'MATH', status: 'ACTIVE', createdAt: new Date('2024-09-01'), updatedAt: new Date() },
    { id: '2023015', userId: 'U008', fullName: 'Charlie Brown', email: 'charlie.b@univ.edu', dateOfBirth: new Date('2003-03-10'), phone: '+1 555-2003', classId: 'PHYS2023', departmentId: 'PHYS', status: 'ACTIVE', createdAt: new Date('2023-09-01'), updatedAt: new Date() },
];

// ==========================================
// COURSES (id = course code)
// ==========================================

export const courses: Course[] = [
    { id: 'CS101', name: 'Introduction to Computer Science', credits: 4, description: 'Foundational concepts in computing', level: 'Undergraduate', createdAt: new Date(), updatedAt: new Date() },
    { id: 'CS201', name: 'Data Structures & Algorithms', credits: 4, description: 'Core data structures and algorithms', level: 'Undergraduate', createdAt: new Date(), updatedAt: new Date() },
    { id: 'CS450', name: 'Machine Learning', credits: 4, description: 'Fundamentals of machine learning', level: 'Graduate', createdAt: new Date(), updatedAt: new Date() },
    { id: 'MATH201', name: 'Linear Algebra', credits: 3, description: 'Vectors, matrices, and linear transformations', level: 'Undergraduate', createdAt: new Date(), updatedAt: new Date() },
    { id: 'ENG102', name: 'Academic Writing', credits: 3, description: 'Research and academic writing skills', level: 'Undergraduate', createdAt: new Date(), updatedAt: new Date() },
];

// ==========================================
// COURSE SECTIONS
// ==========================================

export const courseSections: CourseSection[] = [
    { id: 'SEC001', sectionNumber: '01', courseId: 'CS101', teacherId: 'T001', term: 'Spring2026', capacity: 50, enrolledCount: 45, status: 'OPEN', isScoreLocked: false, schedule: 'Mon, Wed 10:00-11:30', room: 'Science 101', createdAt: new Date(), updatedAt: new Date() },
    { id: 'SEC002', sectionNumber: '02', courseId: 'CS101', teacherId: 'T003', term: 'Spring2026', capacity: 50, enrolledCount: 50, status: 'CLOSED', isScoreLocked: false, schedule: 'Tue, Thu 14:00-15:30', room: 'Science 102', createdAt: new Date(), updatedAt: new Date() },
    { id: 'SEC003', sectionNumber: '01', courseId: 'CS201', teacherId: 'T001', term: 'Spring2026', capacity: 40, enrolledCount: 35, status: 'OPEN', isScoreLocked: false, schedule: 'Mon, Wed, Fri 09:00-10:00', room: 'Tech Lab 201', createdAt: new Date(), updatedAt: new Date() },
    { id: 'SEC004', sectionNumber: '01', courseId: 'MATH201', teacherId: 'T002', term: 'Spring2026', capacity: 45, enrolledCount: 38, status: 'OPEN', isScoreLocked: false, schedule: 'Tue, Thu 10:00-11:30', room: 'Math Hall 101', createdAt: new Date(), updatedAt: new Date() },
];

// ==========================================
// ENROLLMENTS
// ==========================================

export const enrollments: Enrollment[] = [
    { id: 'ENR001', studentId: '2024001', sectionId: 'SEC001', enrollDate: new Date('2026-01-10'), status: 'ENROLLED', createdAt: new Date(), updatedAt: new Date() },
    { id: 'ENR002', studentId: '2024001', sectionId: 'SEC004', enrollDate: new Date('2026-01-10'), status: 'ENROLLED', createdAt: new Date(), updatedAt: new Date() },
    { id: 'ENR003', studentId: '2024002', sectionId: 'SEC003', enrollDate: new Date('2026-01-12'), status: 'ENROLLED', createdAt: new Date(), updatedAt: new Date() },
    { id: 'ENR004', studentId: '2023015', sectionId: 'SEC002', enrollDate: new Date('2026-01-08'), status: 'ENROLLED', createdAt: new Date(), updatedAt: new Date() },
];

// ==========================================
// SCORES
// ==========================================

export const scores: Score[] = [
    { id: 'SCR001', enrollmentId: 'ENR001', processScore: 85, finalScore: 88, totalScore: 87, letterGrade: 'B+', updatedAt: new Date(), updatedBy: 'T001' },
    { id: 'SCR002', enrollmentId: 'ENR002', processScore: 92, finalScore: 90, totalScore: 91, letterGrade: 'A-', updatedAt: new Date(), updatedBy: 'T002' },
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const mockDb = {
    // User queries
    findUserByUsername: (username: string) => userAccounts.find(u => u.username === username),
    findUserById: (id: string) => userAccounts.find(u => u.id === id),

    // Student queries
    findStudentByUserId: (userId: string) => students.find(s => s.userId === userId),
    findStudentById: (id: string) => students.find(s => s.id === id),

    // Teacher queries
    findTeacherByUserId: (userId: string) => teachers.find(t => t.userId === userId),
    findTeacherById: (id: string) => teachers.find(t => t.id === id),

    // Department queries
    findDepartmentById: (id: string) => departments.find(d => d.id === id),
    getAllDepartments: () => departments,

    // Course queries
    findCourseById: (id: string) => courses.find(c => c.id === id),
    getAllCourses: () => courses,

    // Section queries
    findSectionById: (id: string) => courseSections.find(s => s.id === id),
    getSectionsByTeacher: (teacherId: string) => courseSections.filter(s => s.teacherId === teacherId),
    getOpenSections: () => courseSections.filter(s => s.status === 'OPEN'),

    // Enrollment queries
    getEnrollmentsByStudent: (studentId: string) => enrollments.filter(e => e.studentId === studentId),
    getEnrollmentsBySection: (sectionId: string) => enrollments.filter(e => e.sectionId === sectionId),

    // Score queries
    getScoreByEnrollment: (enrollmentId: string) => scores.find(s => s.enrollmentId === enrollmentId),
};

export default mockDb;
