// Mock API Data for testing without backend
// This data matches the database schema

import type { 
    UserDto, 
    DepartmentDto, 
    ClassDto, 
    StudentDto, 
    TeacherDto, 
    CourseDto, 
    SectionDto, 
    EnrollmentDto, 
    GradeDto,
    DashboardStatsDto 
} from './api-client';

// ============================================
// MOCK USERS (password for all: password123)
// ============================================

export const mockUsers: Record<string, { password: string; user: UserDto }> = {
    admin: {
        password: 'password123',
        user: {
            accountId: 1,
            username: 'admin',
            role: 'Admin',
            fullName: 'Quản trị viên Hệ thống',
            email: 'admin@univ.edu.vn',
            isLocked: false,
            createdAt: '2020-01-01T00:00:00Z',
        }
    },
    department: {
        password: 'password123',
        user: {
            accountId: 2,
            username: 'department',
            role: 'Department',
            fullName: 'Phạm Thị Mai',
            email: 'mai.pt@univ.edu.vn',
            isLocked: false,
            createdAt: '2020-01-01T00:00:00Z',
        }
    },
    turing: {
        password: 'password123',
        user: {
            accountId: 3,
            username: 'turing',
            role: 'Teacher',
            fullName: 'TS. Nguyễn Văn Minh',
            email: 'minh.nv@univ.edu.vn',
            isLocked: false,
            createdAt: '2019-08-01T00:00:00Z',
            teacher: {
                teacherId: 'T001',
                fullName: 'TS. Nguyễn Văn Minh',
                email: 'minh.nv@univ.edu.vn',
                deptId: 'CS',
                deptName: 'Công nghệ Thông tin',
                status: 'Active',
                accountId: 3,
            }
        }
    },
    johnson: {
        password: 'password123',
        user: {
            accountId: 4,
            username: 'johnson',
            role: 'Teacher',
            fullName: 'TS. Trần Thị Hoa',
            email: 'hoa.tt@univ.edu.vn',
            isLocked: false,
            createdAt: '2019-08-01T00:00:00Z',
            teacher: {
                teacherId: 'T002',
                fullName: 'TS. Trần Thị Hoa',
                email: 'hoa.tt@univ.edu.vn',
                deptId: 'MATH',
                deptName: 'Toán học',
                status: 'Active',
                accountId: 4,
            }
        }
    },
    hopper: {
        password: 'password123',
        user: {
            accountId: 5,
            username: 'hopper',
            role: 'Teacher',
            fullName: 'TS. Lê Văn Hùng',
            email: 'hung.lv@univ.edu.vn',
            isLocked: false,
            createdAt: '2019-08-01T00:00:00Z',
            teacher: {
                teacherId: 'T003',
                fullName: 'TS. Lê Văn Hùng',
                email: 'hung.lv@univ.edu.vn',
                deptId: 'CS',
                deptName: 'Công nghệ Thông tin',
                status: 'Active',
                accountId: 5,
            }
        }
    },
    alice: {
        password: 'password123',
        user: {
            accountId: 6,
            username: 'alice',
            role: 'Student',
            fullName: 'Nguyễn Văn An',
            email: 'an.nv@univ.edu.vn',
            isLocked: false,
            createdAt: '2024-09-01T00:00:00Z',
            student: {
                studentId: '2024001',
                fullname: 'Nguyễn Văn An',
                dob: '2004-05-15',
                email: 'an.nv@univ.edu.vn',
                deptId: 'CS',
                deptName: 'Công nghệ Thông tin',
                status: 'Active',
                classId: 'CS2024A',
                className: 'CNTT 2024 - Nhóm A',
                accountId: 6,
            }
        }
    },
    bob: {
        password: 'password123',
        user: {
            accountId: 7,
            username: 'bob',
            role: 'Student',
            fullName: 'Trần Thị Bình',
            email: 'binh.tt@univ.edu.vn',
            isLocked: false,
            createdAt: '2024-09-01T00:00:00Z',
            student: {
                studentId: '2024002',
                fullname: 'Trần Thị Bình',
                dob: '2004-08-22',
                email: 'binh.tt@univ.edu.vn',
                deptId: 'MATH',
                deptName: 'Toán học',
                status: 'Active',
                classId: 'MATH2024',
                className: 'Toán học 2024',
                accountId: 7,
            }
        }
    },
    charlie: {
        password: 'password123',
        user: {
            accountId: 8,
            username: 'charlie',
            role: 'Student',
            fullName: 'Lê Văn Cường',
            email: 'cuong.lv@univ.edu.vn',
            isLocked: false,
            createdAt: '2023-09-01T00:00:00Z',
            student: {
                studentId: '2023015',
                fullname: 'Lê Văn Cường',
                dob: '2003-03-10',
                email: 'cuong.lv@univ.edu.vn',
                deptId: 'PHYS',
                deptName: 'Vật lý',
                status: 'Active',
                classId: 'PHYS2023',
                className: 'Vật lý 2023',
                accountId: 8,
            }
        }
    },
};

// ============================================
// MOCK DEPARTMENTS
// ============================================

export const mockDepartments: DepartmentDto[] = [
    { deptId: 'CS', deptName: 'Công nghệ Thông tin', studentCount: 2, teacherCount: 2, courseCount: 3 },
    { deptId: 'MATH', deptName: 'Toán học', studentCount: 1, teacherCount: 1, courseCount: 1 },
    { deptId: 'PHYS', deptName: 'Vật lý', studentCount: 1, teacherCount: 0, courseCount: 0 },
    { deptId: 'ENG', deptName: 'Văn học Anh', studentCount: 0, teacherCount: 0, courseCount: 1 },
    { deptId: 'BIO', deptName: 'Sinh học', studentCount: 0, teacherCount: 0, courseCount: 0 },
];

// ============================================
// MOCK CLASSES
// ============================================

export const mockClasses: ClassDto[] = [
    { classId: 'CS2024A', className: 'CNTT 2024 - Nhóm A', deptId: 'CS', deptName: 'Công nghệ Thông tin', cohortYear: 2024, studentCount: 1 },
    { classId: 'CS2024B', className: 'CNTT 2024 - Nhóm B', deptId: 'CS', deptName: 'Công nghệ Thông tin', cohortYear: 2024, studentCount: 0 },
    { classId: 'MATH2024', className: 'Toán học 2024', deptId: 'MATH', deptName: 'Toán học', cohortYear: 2024, studentCount: 1 },
    { classId: 'PHYS2023', className: 'Vật lý 2023', deptId: 'PHYS', deptName: 'Vật lý', cohortYear: 2023, studentCount: 1 },
];

// ============================================
// MOCK STUDENTS
// ============================================

export const mockStudents: StudentDto[] = [
    { studentId: '2024001', fullname: 'Nguyễn Văn An', dob: '2004-05-15', email: 'an.nv@univ.edu', deptId: 'CS', deptName: 'Công nghệ Thông tin', status: 'Active', classId: 'CS2024A', className: 'CNTT 2024 - Nhóm A', accountId: 6 },
    { studentId: '2024002', fullname: 'Trần Thị Bình', dob: '2004-08-22', email: 'binh.tt@univ.edu', deptId: 'MATH', deptName: 'Toán học', status: 'Active', classId: 'MATH2024', className: 'Toán học 2024', accountId: 7 },
    { studentId: '2023015', fullname: 'Lê Văn Cường', dob: '2003-03-10', email: 'cuong.lv@univ.edu', deptId: 'PHYS', deptName: 'Vật lý', status: 'Active', classId: 'PHYS2023', className: 'Vật lý 2023', accountId: 8 },
];

// ============================================
// MOCK TEACHERS
// ============================================

export const mockTeachers: TeacherDto[] = [
    { teacherId: 'T001', fullName: 'TS. Nguyễn Văn Minh', email: 'minh.nv@univ.edu', deptId: 'CS', deptName: 'Công nghệ Thông tin', status: 'Active', accountId: 3, sectionCount: 2 },
    { teacherId: 'T002', fullName: 'TS. Trần Thị Hoa', email: 'hoa.tt@univ.edu', deptId: 'MATH', deptName: 'Toán học', status: 'Active', accountId: 4, sectionCount: 1 },
    { teacherId: 'T003', fullName: 'TS. Lê Văn Hùng', email: 'hung.lv@univ.edu', deptId: 'CS', deptName: 'Công nghệ Thông tin', status: 'Active', accountId: 5, sectionCount: 1 },
];

// ============================================
// MOCK COURSES
// ============================================

export const mockCourses: CourseDto[] = [
    { courseId: 'CS101', courseName: 'Nhập môn Khoa học Máy tính', credits: 4, deptId: 'CS', deptName: 'Công nghệ Thông tin', description: 'Các khái niệm cơ bản về máy tính', sectionCount: 2 },
    { courseId: 'CS201', courseName: 'Cấu trúc Dữ liệu & Giải thuật', credits: 4, deptId: 'CS', deptName: 'Công nghệ Thông tin', description: 'Cấu trúc dữ liệu và giải thuật cơ bản', sectionCount: 1 },
    { courseId: 'CS450', courseName: 'Học Máy', credits: 4, deptId: 'CS', deptName: 'Công nghệ Thông tin', description: 'Cơ bản về học máy', sectionCount: 0 },
    { courseId: 'MATH201', courseName: 'Đại số Tuyến tính', credits: 3, deptId: 'MATH', deptName: 'Toán học', description: 'Vector, ma trận và phép biến đổi tuyến tính', sectionCount: 1 },
    { courseId: 'ENG102', courseName: 'Viết Học thuật', credits: 3, deptId: 'ENG', deptName: 'Văn học Anh', description: 'Kỹ năng nghiên cứu và viết học thuật', sectionCount: 0 },
];

// ============================================
// MOCK SECTIONS
// ============================================

export const mockSections: SectionDto[] = [
    { sectionId: 1, courseId: 'CS101', courseName: 'Nhập môn Khoa học Máy tính', semester: 'HK1-2026', teacherId: 'T001', teacherName: 'TS. Nguyễn Văn Minh', capacity: 50, enrolledCount: 2, status: 'Open', isGradeLocked: false, schedule: 'Thứ 2, 4: 10:00-11:30', room: 'Phòng 101' },
    { sectionId: 2, courseId: 'CS101', courseName: 'Nhập môn Khoa học Máy tính', semester: 'HK1-2026', teacherId: 'T003', teacherName: 'TS. Lê Văn Hùng', capacity: 50, enrolledCount: 1, status: 'Open', isGradeLocked: false, schedule: 'Thứ 3, 5: 14:00-15:30', room: 'Phòng 102' },
    { sectionId: 3, courseId: 'CS201', courseName: 'Cấu trúc Dữ liệu & Giải thuật', semester: 'HK1-2026', teacherId: 'T001', teacherName: 'TS. Nguyễn Văn Minh', capacity: 40, enrolledCount: 1, status: 'Open', isGradeLocked: false, schedule: 'Thứ 2, 4, 6: 09:00-10:00', room: 'Phòng Lab 201' },
    { sectionId: 4, courseId: 'MATH201', courseName: 'Đại số Tuyến tính', semester: 'HK1-2026', teacherId: 'T002', teacherName: 'TS. Trần Thị Hoa', capacity: 45, enrolledCount: 1, status: 'Open', isGradeLocked: false, schedule: 'Thứ 3, 5: 10:00-11:30', room: 'Phòng 301' },
];

// ============================================
// MOCK ENROLLMENTS
// ============================================

export const mockEnrollments: EnrollmentDto[] = [
    { enrollmentId: 1, studentId: '2024001', studentName: 'Nguyễn Văn An', sectionId: 1, courseName: 'Nhập môn Khoa học Máy tính', semester: 'HK1-2026', enrollDate: '2026-01-10T00:00:00Z', status: 'Enrolled', grade: { gradeId: 1, enrollmentId: 1, midterm: 85, final: 88, other: 90, gpaPoint: 3.5, letterGrade: 'B+', updatedAt: '2026-01-15T00:00:00Z', updatedBy: 'T001' } },
    { enrollmentId: 2, studentId: '2024001', studentName: 'Nguyễn Văn An', sectionId: 4, courseName: 'Đại số Tuyến tính', semester: 'HK1-2026', enrollDate: '2026-01-10T00:00:00Z', status: 'Enrolled', grade: { gradeId: 2, enrollmentId: 2, midterm: 92, final: 90, other: 88, gpaPoint: 3.7, letterGrade: 'A-', updatedAt: '2026-01-15T00:00:00Z', updatedBy: 'T002' } },
    { enrollmentId: 3, studentId: '2024002', studentName: 'Trần Thị Bình', sectionId: 3, courseName: 'Cấu trúc Dữ liệu & Giải thuật', semester: 'HK1-2026', enrollDate: '2026-01-12T00:00:00Z', status: 'Enrolled' },
    { enrollmentId: 4, studentId: '2023015', studentName: 'Lê Văn Cường', sectionId: 2, courseName: 'Nhập môn Khoa học Máy tính', semester: 'HK1-2026', enrollDate: '2026-01-08T00:00:00Z', status: 'Enrolled' },
];

// ============================================
// MOCK GRADES
// ============================================

export const mockGrades: GradeDto[] = [
    { gradeId: 1, enrollmentId: 1, midterm: 85, final: 88, other: 90, gpaPoint: 3.5, letterGrade: 'B+', updatedAt: '2026-01-15T00:00:00Z', updatedBy: 'T001' },
    { gradeId: 2, enrollmentId: 2, midterm: 92, final: 90, other: 88, gpaPoint: 3.7, letterGrade: 'A-', updatedAt: '2026-01-15T00:00:00Z', updatedBy: 'T002' },
];

// ============================================
// MOCK DASHBOARD STATS
// ============================================

export const mockDashboardStats: DashboardStatsDto = {
    totalStudents: 3,
    totalTeachers: 3,
    totalCourses: 5,
    totalEnrollments: 4,
    activeSections: 4,
    totalDepartments: 5,
};

// ============================================
// Helper function to simulate API delay
// ============================================

export const simulateDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));
