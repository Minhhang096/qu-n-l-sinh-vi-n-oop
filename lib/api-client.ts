// API Client for connecting to C# Backend
// Falls back to mock data when backend is not available (optional)

import {
  mockUsers,
  mockDepartments,
  mockClasses,
  mockStudents,
  mockTeachers,
  mockCourses,
  mockSections,
  mockEnrollments,
  mockGrades,
  mockDashboardStats,
  simulateDelay,
} from "./mock-api-data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Flag to use mock data (set to false to use real backend)
const USE_MOCK_DATA = false;

// =======================
// Types matching backend DTOs
// =======================
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserDto;
}

export interface UserDto {
  accountId: number;
  username: string;
  role: string;
  fullName?: string;
  email?: string;
  isLocked: boolean;
  createdAt: string;
  student?: StudentDto;
  teacher?: TeacherDto;
}

export interface DepartmentDto {
  deptId: string;
  deptName: string;
  studentCount?: number;
  teacherCount?: number;
  courseCount?: number;
}

export interface ClassDto {
  classId: string;
  className: string;
  deptId: string;
  deptName?: string;
  cohortYear: number;
  studentCount?: number;
}

export interface StudentDto {
  studentId: string;
  fullname: string;
  dob?: string;
  email?: string;
  deptId: string;
  deptName?: string;
  status: string;
  classId: string;
  className?: string;
  accountId?: number;
}

export interface TeacherDto {
  teacherId: string;
  fullName: string;
  email?: string;
  deptId: string;
  deptName?: string;
  status: string;
  accountId?: number;
  sectionCount?: number;
}

export interface CourseDto {
  courseId: string;
  courseName: string;
  credits: number;
  deptId: string;
  deptName?: string;
  description?: string;
  sectionCount?: number;
}

export interface SectionDto {
  sectionId: number;
  courseId: string;
  courseName?: string;
  semester: string;
  teacherId: string;
  teacherName?: string;
  capacity: number;
  enrolledCount: number;
  status: string;
  isGradeLocked: boolean;
  schedule?: string;
  room?: string;
}

export interface EnrollmentDto {
  enrollmentId: number;
  studentId: string;
  studentName?: string;
  sectionId: number;
  courseName?: string;
  semester?: string;
  enrollDate: string;
  status: string;
  grade?: GradeDto;
}

export interface GradeDto {
  gradeId: number;
  enrollmentId: number;
  midterm?: number;
  final?: number;
  other?: number;
  gpaPoint?: number;
  letterGrade?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface DashboardStatsDto {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeSections: number;
  totalDepartments: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =======================
// Token management
// =======================
const TOKEN_KEY = "ums_token";
const USER_KEY = "ums_user";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): UserDto | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setStoredUser = (user: UserDto): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// =======================
// Helpers
// =======================
function normalizeApiResponse<T>(json: unknown): ApiResponse<T> {
  // If backend already returns {success, data}
  if (json && typeof json === "object" && "success" in json) {
    // If it has data -> perfect
    if ("data" in json) return json as ApiResponse<T>;

    // If it has success but no data, wrap the remaining as data when possible
    // (Some endpoints return {success, token, user} etc. -> we DON'T use this for login)
    return {
      success: Boolean(json.success),
      message: json.message,
      data: (json.data ?? json) as T,
    };
  }

  // If backend returns raw array/object
  return { success: true, data: json as T };
}

async function safeReadJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Generic fetch wrapper with auth + normalize
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    // Create abort controller with 10 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json = await safeReadJson(response);

    if (!response.ok) {
      // Try to extract message
      const msg =
        (json && typeof json === "object" && json.message) ||
        `HTTP error! status: ${response.status}`;
      return { success: false, message: msg };
    }

    return normalizeApiResponse<T>(json);
  } catch (error) {
    console.error("API Error:", error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: "Unable to connect to API. Is the server running at " + API_BASE_URL + "?",
      };
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        message: "Request timeout - server not responding",
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

// =======================
// Auth API
// =======================
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK_DATA) {
      await simulateDelay(500);
      const mockUser = mockUsers[credentials.username.toLowerCase()];

      if (!mockUser) return { success: false, message: "User not found" };
      if (mockUser.password !== credentials.password)
        return { success: false, message: "Invalid password" };

      const token = `mock_jwt_token_${mockUser.user.accountId}_${Date.now()}`;
      setToken(token);
      setStoredUser(mockUser.user);

      return {
        success: true,
        message: "Login successful",
        token,
        user: mockUser.user,
      };
    }

    // IMPORTANT:
    // login endpoints often return {success, token, user} WITHOUT wrapping in {data:...}
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const json = (await safeReadJson(res)) as any;

      if (!res.ok) {
        return {
          success: false,
          message:
            (json && typeof json === "object" && json.message) ||
            `HTTP error! status: ${res.status}`,
        };
      }

      const loginData: LoginResponse = normalizeApiResponse<LoginResponse>(json)
        .data as any;

      // If backend already returns LoginResponse directly, normalize above may wrap it incorrectly.
      // So handle both cases safely:
      const finalLogin: LoginResponse =
        (json && typeof json === "object" && "success" in json && !("data" in json))
          ? (json as LoginResponse)
          : (loginData as LoginResponse);

      if (finalLogin.success && finalLogin.token) {
        setToken(finalLogin.token);
      }
      if (finalLogin.success && finalLogin.user) {
        setStoredUser(finalLogin.user);
      }

      return finalLogin;
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Network error",
      };
    }
  },

  register: async (data: {
    username: string;
    password: string;
    email: string;
    fullName: string;
    role?: string;
  }): Promise<ApiResponse<UserDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay(500);
      return { success: true, message: "Registration successful (mock)" };
    }
    return fetchApi<UserDto>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getCurrentUser: async (): Promise<ApiResponse<UserDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay(200);
      const stored = getStoredUser();
      if (stored) return { success: true, data: stored };
      return { success: false, message: "Not authenticated" };
    }
    return fetchApi<UserDto>("/auth/me");
  },

  getAllUsers: async (): Promise<ApiResponse<UserDto[]>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay(200);
      return { success: true, data: Object.values(mockUsers).map(u => u.user) };
    }
    return fetchApi<UserDto[]>("/auth/all");
  },

  logout: (): void => {
    removeToken();
  },
};

// =======================
// Departments API
// =======================
export const departmentsApi = {
  getAll: async (): Promise<ApiResponse<DepartmentDto[]>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { success: true, data: mockDepartments };
    }
    return fetchApi<DepartmentDto[]>("/departments");
  },

  getById: async (id: string): Promise<ApiResponse<DepartmentDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const dept = mockDepartments.find((d) => d.deptId === id);
      return dept
        ? { success: true, data: dept }
        : { success: false, message: "Department not found" };
    }
    return fetchApi<DepartmentDto>(`/departments/${id}`);
  },

  create: async (data: {
    deptId: string;
    deptName: string;
  }): Promise<ApiResponse<DepartmentDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const newDept: DepartmentDto = {
        ...data,
        studentCount: 0,
        teacherCount: 0,
        courseCount: 0,
      };
      mockDepartments.push(newDept);
      return { success: true, data: newDept, message: "Department created successfully" };
    }
    return fetchApi<DepartmentDto>("/departments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: { deptId: string; deptName: string }
  ): Promise<ApiResponse<DepartmentDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockDepartments.findIndex((d) => d.deptId === id);
      if (index >= 0) {
        mockDepartments[index] = { ...mockDepartments[index], ...data };
        return {
          success: true,
          data: mockDepartments[index],
          message: "Department updated successfully",
        };
      }
      return { success: false, message: "Department not found" };
    }
    return fetchApi<DepartmentDto>(`/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<object>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockDepartments.findIndex((d) => d.deptId === id);
      if (index >= 0) {
        mockDepartments.splice(index, 1);
        return { success: true, message: "Department deleted successfully" };
      }
      return { success: false, message: "Department not found" };
    }
    return fetchApi<object>(`/departments/${id}`, { method: "DELETE" });
  },
};

// =======================
// Classes API
// =======================
export const classesApi = {
  getAll: async (deptId?: string): Promise<ApiResponse<ClassDto[]>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      let data = mockClasses;
      if (deptId) data = data.filter((c) => c.deptId === deptId);
      return { success: true, data };
    }
    return fetchApi<ClassDto[]>(`/classes${deptId ? `?deptId=${deptId}` : ""}`);
  },

  getById: async (id: string): Promise<ApiResponse<ClassDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const cls = mockClasses.find((c) => c.classId === id);
      return cls ? { success: true, data: cls } : { success: false, message: "Class not found" };
    }
    return fetchApi<ClassDto>(`/classes/${id}`);
  },

  create: async (data: {
    classId: string;
    className: string;
    deptId: string;
    cohortYear: number;
  }): Promise<ApiResponse<ClassDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const dept = mockDepartments.find((d) => d.deptId === data.deptId);
      const newClass: ClassDto = { ...data, deptName: dept?.deptName, studentCount: 0 };
      mockClasses.push(newClass);
      return { success: true, data: newClass, message: "Class created successfully" };
    }
    return fetchApi<ClassDto>("/classes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: { classId: string; className: string; deptId: string; cohortYear: number }
  ): Promise<ApiResponse<ClassDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockClasses.findIndex((c) => c.classId === id);
      if (index >= 0) {
        mockClasses[index] = { ...mockClasses[index], ...data };
        return { success: true, data: mockClasses[index], message: "Class updated successfully" };
      }
      return { success: false, message: "Class not found" };
    }
    return fetchApi<ClassDto>(`/classes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<object>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockClasses.findIndex((c) => c.classId === id);
      if (index >= 0) {
        mockClasses.splice(index, 1);
        return { success: true, message: "Class deleted successfully" };
      }
      return { success: false, message: "Class not found" };
    }
    return fetchApi<object>(`/classes/${id}`, { method: "DELETE" });
  },
};

// =======================
// Students API
// =======================
export const studentsApi = {
  getAll: async (filters?: {
    deptId?: string;
    classId?: string;
    status?: string;
  }): Promise<ApiResponse<StudentDto[]>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      let data = [...mockStudents];
      if (filters?.deptId) data = data.filter((s) => s.deptId === filters.deptId);
      if (filters?.classId) data = data.filter((s) => s.classId === filters.classId);
      if (filters?.status) data = data.filter((s) => s.status === filters.status);
      return { success: true, data };
    }
    const params = new URLSearchParams();
    if (filters?.deptId) params.append("deptId", filters.deptId);
    if (filters?.classId) params.append("classId", filters.classId);
    if (filters?.status) params.append("status", filters.status);
    return fetchApi<StudentDto[]>(`/students${params.toString() ? `?${params}` : ""}`);
  },

  getById: async (id: string): Promise<ApiResponse<StudentDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const student = mockStudents.find((s) => s.studentId === id);
      return student
        ? { success: true, data: student }
        : { success: false, message: "Student not found" };
    }
    return fetchApi<StudentDto>(`/students/${id}`);
  },

  create: async (data: {
    studentId: string;
    fullname: string;
    dob?: string;
    email?: string;
    deptId: string;
    status?: string;
    classId: string;
  }): Promise<ApiResponse<StudentDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const dept = mockDepartments.find((d) => d.deptId === data.deptId);
      const cls = mockClasses.find((c) => c.classId === data.classId);
      const newStudent: StudentDto = {
        ...data,
        status: data.status || "Active",
        deptName: dept?.deptName,
        className: cls?.className,
      };
      mockStudents.push(newStudent);
      return { success: true, data: newStudent, message: "Student created successfully" };
    }
    return fetchApi<StudentDto>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: {
      studentId: string;
      fullname: string;
      dob?: string;
      email?: string;
      deptId: string;
      status?: string;
      classId: string;
    }
  ): Promise<ApiResponse<StudentDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockStudents.findIndex((s) => s.studentId === id);
      if (index >= 0) {
        mockStudents[index] = { ...mockStudents[index], ...data };
        return { success: true, data: mockStudents[index], message: "Student updated successfully" };
      }
      return { success: false, message: "Student not found" };
    }
    return fetchApi<StudentDto>(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<object>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockStudents.findIndex((s) => s.studentId === id);
      if (index >= 0) {
        mockStudents.splice(index, 1);
        return { success: true, message: "Student deleted successfully" };
      }
      return { success: false, message: "Student not found" };
    }
    return fetchApi<object>(`/students/${id}`, { method: "DELETE" });
  },
};

// =======================
// Teachers API
// =======================
export const teachersApi = {
  getAll: async (deptId?: string): Promise<ApiResponse<TeacherDto[]>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      let data = [...mockTeachers];
      if (deptId) data = data.filter((t) => t.deptId === deptId);
      return { success: true, data };
    }
    return fetchApi<TeacherDto[]>(`/teachers${deptId ? `?deptId=${deptId}` : ""}`);
  },

  getById: async (id: string): Promise<ApiResponse<TeacherDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const teacher = mockTeachers.find((t) => t.teacherId === id);
      return teacher
        ? { success: true, data: teacher }
        : { success: false, message: "Teacher not found" };
    }
    return fetchApi<TeacherDto>(`/teachers/${id}`);
  },

  create: async (data: {
    teacherId: string;
    fullName: string;
    email?: string;
    deptId: string;
    status?: string;
  }): Promise<ApiResponse<TeacherDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const dept = mockDepartments.find((d) => d.deptId === data.deptId);
      const newTeacher: TeacherDto = {
        ...data,
        status: data.status || "Active",
        deptName: dept?.deptName,
        sectionCount: 0,
      };
      mockTeachers.push(newTeacher);
      return { success: true, data: newTeacher, message: "Teacher created successfully" };
    }
    return fetchApi<TeacherDto>("/teachers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: { teacherId: string; fullName: string; email?: string; deptId: string; status?: string }
  ): Promise<ApiResponse<TeacherDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockTeachers.findIndex((t) => t.teacherId === id);
      if (index >= 0) {
        mockTeachers[index] = { ...mockTeachers[index], ...data };
        return { success: true, data: mockTeachers[index], message: "Teacher updated successfully" };
      }
      return { success: false, message: "Teacher not found" };
    }
    return fetchApi<TeacherDto>(`/teachers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<object>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockTeachers.findIndex((t) => t.teacherId === id);
      if (index >= 0) {
        mockTeachers.splice(index, 1);
        return { success: true, message: "Teacher deleted successfully" };
      }
      return { success: false, message: "Teacher not found" };
    }
    return fetchApi<object>(`/teachers/${id}`, { method: "DELETE" });
  },
};

// =======================
// Courses API
// =======================
export const coursesApi = {
  getAll: async (deptId?: string): Promise<ApiResponse<CourseDto[]>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      let data = [...mockCourses];
      if (deptId) data = data.filter((c) => c.deptId === deptId);
      return { success: true, data };
    }
    return fetchApi<CourseDto[]>(`/courses${deptId ? `?deptId=${deptId}` : ""}`);
  },

  getById: async (id: string): Promise<ApiResponse<CourseDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const course = mockCourses.find((c) => c.courseId === id);
      return course
        ? { success: true, data: course }
        : { success: false, message: "Course not found" };
    }
    return fetchApi<CourseDto>(`/courses/${id}`);
  },

  create: async (data: {
    courseId: string;
    courseName: string;
    credits: number;
    deptId: string;
    description?: string;
  }): Promise<ApiResponse<CourseDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const dept = mockDepartments.find((d) => d.deptId === data.deptId);
      const newCourse: CourseDto = { ...data, deptName: dept?.deptName, sectionCount: 0 };
      mockCourses.push(newCourse);
      return { success: true, data: newCourse, message: "Course created successfully" };
    }
    return fetchApi<CourseDto>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: { courseId: string; courseName: string; credits: number; deptId: string; description?: string }
  ): Promise<ApiResponse<CourseDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockCourses.findIndex((c) => c.courseId === id);
      if (index >= 0) {
        mockCourses[index] = { ...mockCourses[index], ...data };
        return { success: true, data: mockCourses[index], message: "Course updated successfully" };
      }
      return { success: false, message: "Course not found" };
    }
    return fetchApi<CourseDto>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<object>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockCourses.findIndex((c) => c.courseId === id);
      if (index >= 0) {
        mockCourses.splice(index, 1);
        return { success: true, message: "Course deleted successfully" };
      }
      return { success: false, message: "Course not found" };
    }
    return fetchApi<object>(`/courses/${id}`, { method: "DELETE" });
  },
};

// =======================
// Sections API
// =======================
export const sectionsApi = {
  getAll: async (filters?: {
    courseId?: string;
    teacherId?: string;
    semester?: string;
    status?: string;
  }): Promise<ApiResponse<SectionDto[]>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      let data = [...mockSections];
      if (filters?.courseId) data = data.filter((s) => s.courseId === filters.courseId);
      if (filters?.teacherId) data = data.filter((s) => s.teacherId === filters.teacherId);
      if (filters?.semester) data = data.filter((s) => s.semester === filters.semester);
      if (filters?.status) data = data.filter((s) => s.status === filters.status);
      return { success: true, data };
    }
    const params = new URLSearchParams();
    if (filters?.courseId) params.append("courseId", filters.courseId);
    if (filters?.teacherId) params.append("teacherId", filters.teacherId);
    if (filters?.semester) params.append("semester", filters.semester);
    if (filters?.status) params.append("status", filters.status);
    return fetchApi<SectionDto[]>(`/sections${params.toString() ? `?${params}` : ""}`);
  },

  getById: async (id: number): Promise<ApiResponse<SectionDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const section = mockSections.find((s) => s.sectionId === id);
      return section
        ? { success: true, data: section }
        : { success: false, message: "Section not found" };
    }
    return fetchApi<SectionDto>(`/sections/${id}`);
  },

  create: async (data: {
    courseId: string;
    semester: string;
    teacherId: string;
    capacity: number;
    status?: string;
    schedule?: string;
    room?: string;
  }): Promise<ApiResponse<SectionDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const course = mockCourses.find((c) => c.courseId === data.courseId);
      const teacher = mockTeachers.find((t) => t.teacherId === data.teacherId);
      const newSection: SectionDto = {
        sectionId: mockSections.length + 1,
        ...data,
        status: data.status || "Open",
        courseName: course?.courseName,
        teacherName: teacher?.fullName,
        enrolledCount: 0,
        isGradeLocked: false,
      };
      mockSections.push(newSection);
      return { success: true, data: newSection, message: "Section created successfully" };
    }
    return fetchApi<SectionDto>("/sections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: number,
    data: {
      courseId: string;
      semester: string;
      teacherId: string;
      capacity: number;
      status?: string;
      schedule?: string;
      room?: string;
    }
  ): Promise<ApiResponse<SectionDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockSections.findIndex((s) => s.sectionId === id);
      if (index >= 0) {
        mockSections[index] = { ...mockSections[index], ...data };
        return { success: true, data: mockSections[index], message: "Section updated successfully" };
      }
      return { success: false, message: "Section not found" };
    }
    return fetchApi<SectionDto>(`/sections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  toggleGradeLock: async (id: number): Promise<ApiResponse<SectionDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockSections.findIndex((s) => s.sectionId === id);
      if (index >= 0) {
        mockSections[index].isGradeLocked = !mockSections[index].isGradeLocked;
        return {
          success: true,
          data: mockSections[index],
          message: mockSections[index].isGradeLocked ? "Grades locked" : "Grades unlocked",
        };
      }
      return { success: false, message: "Section not found" };
    }
    return fetchApi<SectionDto>(`/sections/${id}/lock-grade`, { method: "PATCH" });
  },

  delete: async (id: number): Promise<ApiResponse<object>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockSections.findIndex((s) => s.sectionId === id);
      if (index >= 0) {
        mockSections.splice(index, 1);
        return { success: true, message: "Section deleted successfully" };
      }
      return { success: false, message: "Section not found" };
    }
    return fetchApi<object>(`/sections/${id}`, { method: "DELETE" });
  },
};

// =======================
// Enrollments API
// =======================
export const enrollmentsApi = {
  getAll: async (filters?: {
    studentId?: string;
    sectionId?: number;
    status?: string;
  }): Promise<ApiResponse<EnrollmentDto[]>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      let data = [...mockEnrollments];
      if (filters?.studentId) data = data.filter((e) => e.studentId === filters.studentId);
      if (filters?.sectionId) data = data.filter((e) => e.sectionId === filters.sectionId);
      if (filters?.status) data = data.filter((e) => e.status === filters.status);
      return { success: true, data };
    }
    const params = new URLSearchParams();
    if (filters?.studentId) params.append("studentId", filters.studentId);
    if (filters?.sectionId) params.append("sectionId", String(filters.sectionId));
    if (filters?.status) params.append("status", filters.status);
    return fetchApi<EnrollmentDto[]>(`/enrollments${params.toString() ? `?${params}` : ""}`);
  },

  getById: async (id: number): Promise<ApiResponse<EnrollmentDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const enrollment = mockEnrollments.find((e) => e.enrollmentId === id);
      return enrollment
        ? { success: true, data: enrollment }
        : { success: false, message: "Enrollment not found" };
    }
    return fetchApi<EnrollmentDto>(`/enrollments/${id}`);
  },

  create: async (data: { studentId: string; sectionId: number }): Promise<ApiResponse<EnrollmentDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const student = mockStudents.find((s) => s.studentId === data.studentId);
      const section = mockSections.find((s) => s.sectionId === data.sectionId);

      if (!student || !section) return { success: false, message: "Student or section not found" };

      const newEnrollment: EnrollmentDto = {
        enrollmentId: mockEnrollments.length + 1,
        studentId: data.studentId,
        studentName: student.fullname,
        sectionId: data.sectionId,
        courseName: section.courseName,
        semester: section.semester,
        enrollDate: new Date().toISOString(),
        status: "Enrolled",
      };
      mockEnrollments.push(newEnrollment);
      return { success: true, data: newEnrollment, message: "Enrollment created successfully" };
    }
    return fetchApi<EnrollmentDto>("/enrollments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id: number, status: string): Promise<ApiResponse<EnrollmentDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockEnrollments.findIndex((e) => e.enrollmentId === id);
      if (index >= 0) {
        mockEnrollments[index].status = status;
        return { success: true, data: mockEnrollments[index], message: "Enrollment status updated" };
      }
      return { success: false, message: "Enrollment not found" };
    }
    // Send as object -> backend usually expects { status: "Cancelled" }
    return fetchApi<EnrollmentDto>(`/enrollments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: number): Promise<ApiResponse<object>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const index = mockEnrollments.findIndex((e) => e.enrollmentId === id);
      if (index >= 0) {
        mockEnrollments.splice(index, 1);
        return { success: true, message: "Enrollment deleted successfully" };
      }
      return { success: false, message: "Enrollment not found" };
    }
    return fetchApi<object>(`/enrollments/${id}`, { method: "DELETE" });
  },
};

// =======================
// Grades API
// =======================
export const gradesApi = {
  getByEnrollment: async (enrollmentId: number): Promise<ApiResponse<GradeDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const grade = mockGrades.find((g) => g.enrollmentId === enrollmentId);
      return grade ? { success: true, data: grade } : { success: false, message: "Grade not found" };
    }
    return fetchApi<GradeDto>(`/grades/enrollment/${enrollmentId}`);
  },

  getByStudent: async (studentId: string): Promise<ApiResponse<GradeDto[]>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const studentEnrollments = mockEnrollments.filter((e) => e.studentId === studentId);
      const grades = mockGrades.filter((g) =>
        studentEnrollments.some((e) => e.enrollmentId === g.enrollmentId)
      );
      return { success: true, data: grades };
    }
    return fetchApi<GradeDto[]>(`/grades/student/${studentId}`);
  },

  update: async (data: {
    enrollmentId: number;
    midterm?: number;
    final?: number;
    other?: number;
  }): Promise<ApiResponse<GradeDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      // mock logic giữ nguyên
      let gradeIndex = mockGrades.findIndex((g) => g.enrollmentId === data.enrollmentId);

      const mid = data.midterm || 0;
      const fin = data.final || 0;
      const oth = data.other || 0;
      const totalScore = mid * 0.3 + fin * 0.5 + oth * 0.2;

      let gpaPoint = 0;
      let letterGrade = "F";
      if (totalScore >= 90) { gpaPoint = 4.0; letterGrade = "A"; }
      else if (totalScore >= 85) { gpaPoint = 3.7; letterGrade = "A-"; }
      else if (totalScore >= 80) { gpaPoint = 3.3; letterGrade = "B+"; }
      else if (totalScore >= 75) { gpaPoint = 3.0; letterGrade = "B"; }
      else if (totalScore >= 70) { gpaPoint = 2.7; letterGrade = "B-"; }
      else if (totalScore >= 65) { gpaPoint = 2.3; letterGrade = "C+"; }
      else if (totalScore >= 60) { gpaPoint = 2.0; letterGrade = "C"; }
      else if (totalScore >= 55) { gpaPoint = 1.7; letterGrade = "C-"; }
      else if (totalScore >= 50) { gpaPoint = 1.0; letterGrade = "D"; }

      if (gradeIndex >= 0) {
        mockGrades[gradeIndex] = {
          ...mockGrades[gradeIndex],
          ...data,
          gpaPoint,
          letterGrade,
          updatedAt: new Date().toISOString(),
        };
        return { success: true, data: mockGrades[gradeIndex], message: "Grade updated successfully" };
      } else {
        const newGrade: GradeDto = {
          gradeId: mockGrades.length + 1,
          ...data,
          gpaPoint,
          letterGrade,
          updatedAt: new Date().toISOString(),
        };
        mockGrades.push(newGrade);
        return { success: true, data: newGrade, message: "Grade created successfully" };
      }
    }

    return fetchApi<GradeDto>("/grades", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// =======================
// Stats API
// =======================
export const statsApi = {
  getDashboard: async (): Promise<ApiResponse<DashboardStatsDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { success: true, data: mockDashboardStats };
    }
    return fetchApi<DashboardStatsDto>("/stats/dashboard");
  },

  getDepartmentStats: async (deptId: string): Promise<ApiResponse<DashboardStatsDto>> => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const deptStudents = mockStudents.filter((s) => s.deptId === deptId).length;
      const deptTeachers = mockTeachers.filter((t) => t.deptId === deptId).length;
      const deptCourses = mockCourses.filter((c) => c.deptId === deptId).length;
      return {
        success: true,
        data: {
          totalStudents: deptStudents,
          totalTeachers: deptTeachers,
          totalCourses: deptCourses,
          totalEnrollments: 0,
          activeSections: 0,
          totalDepartments: 1,
        },
      };
    }
    return fetchApi<DashboardStatsDto>(`/stats/department/${deptId}`);
  },
};

// Default export with all APIs
const api = {
  auth: authApi,
  departments: departmentsApi,
  classes: classesApi,
  students: studentsApi,
  teachers: teachersApi,
  courses: coursesApi,
  sections: sectionsApi,
  enrollments: enrollmentsApi,
  grades: gradesApi,
  stats: statsApi,
};

export default api;
