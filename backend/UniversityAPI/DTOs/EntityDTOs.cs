namespace UniversityAPI.DTOs;

// Department DTOs
public class DepartmentDto
{
    public string DeptId { get; set; } = string.Empty;
    public string DeptName { get; set; } = string.Empty;
    public int StudentCount { get; set; }
    public int TeacherCount { get; set; }
    public int CourseCount { get; set; }
}

public class CreateDepartmentRequest
{
    public string DeptId { get; set; } = string.Empty;
    public string DeptName { get; set; } = string.Empty;
}

// Class DTOs
public class ClassDto
{
    public string ClassId { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public string DeptId { get; set; } = string.Empty;
    public string? DeptName { get; set; }
    public int CohortYear { get; set; }
    public int StudentCount { get; set; }
}

public class CreateClassRequest
{
    public string ClassId { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public string DeptId { get; set; } = string.Empty;
    public int CohortYear { get; set; }
}

// Student DTOs
public class StudentDto
{
    public string StudentId { get; set; } = string.Empty;
    public string Fullname { get; set; } = string.Empty;
    public DateTime? Dob { get; set; }
    public string? Email { get; set; }
    public string DeptId { get; set; } = string.Empty;
    public string? DeptName { get; set; }
    public string Status { get; set; } = string.Empty;
    public string ClassId { get; set; } = string.Empty;
    public string? ClassName { get; set; }
    public int? AccountId { get; set; }
}

public class CreateStudentRequest
{
    public string StudentId { get; set; } = string.Empty;
    public string Fullname { get; set; } = string.Empty;
    public DateTime? Dob { get; set; }
    public string? Email { get; set; }
    public string DeptId { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public string ClassId { get; set; } = string.Empty;
}

// Teacher DTOs
public class TeacherDto
{
    public string TeacherId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string DeptId { get; set; } = string.Empty;
    public string? DeptName { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? AccountId { get; set; }
    public int SectionCount { get; set; }
}

public class CreateTeacherRequest
{
    public string TeacherId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string DeptId { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
}

// Course DTOs
public class CourseDto
{
    public string CourseId { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public int Credits { get; set; }
    public string DeptId { get; set; } = string.Empty;
    public string? DeptName { get; set; }
    public string? Description { get; set; }
    public int SectionCount { get; set; }
}

public class CreateCourseRequest
{
    public string CourseId { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public int Credits { get; set; }
    public string DeptId { get; set; } = string.Empty;
    public string? Description { get; set; }
}

// Section DTOs
public class SectionDto
{
    public int SectionId { get; set; }
    public string CourseId { get; set; } = string.Empty;
    public string? CourseName { get; set; }
    public string Semester { get; set; } = string.Empty;
    public string TeacherId { get; set; } = string.Empty;
    public string? TeacherName { get; set; }
    public int Capacity { get; set; }
    public int EnrolledCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsGradeLocked { get; set; }
    public string? Schedule { get; set; }
    public string? Room { get; set; }
}

public class CreateSectionRequest
{
    public string CourseId { get; set; } = string.Empty;
    public string Semester { get; set; } = string.Empty;
    public string TeacherId { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string Status { get; set; } = "Open";
    public string? Schedule { get; set; }
    public string? Room { get; set; }
}

// Enrollment DTOs
public class EnrollmentDto
{
    public int EnrollmentId { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string? StudentName { get; set; }
    public int SectionId { get; set; }
    public string? CourseName { get; set; }
    public string? Semester { get; set; }
    public DateTime EnrollDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public GradeDto? Grade { get; set; }
}

public class CreateEnrollmentRequest
{
    public string StudentId { get; set; } = string.Empty;
    public int SectionId { get; set; }
}

// Grade DTOs
public class GradeDto
{
    public int GradeId { get; set; }
    public int EnrollmentId { get; set; }
    public decimal? Midterm { get; set; }
    public decimal? Final { get; set; }
    public decimal? Other { get; set; }
    public decimal? GpaPoint { get; set; }
    public string? LetterGrade { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}

public class UpdateGradeRequest
{
    public int EnrollmentId { get; set; }
    public decimal? Midterm { get; set; }
    public decimal? Final { get; set; }
    public decimal? Other { get; set; }
}

// Stats DTOs
public class DashboardStatsDto
{
    public int TotalStudents { get; set; }
    public int TotalTeachers { get; set; }
    public int TotalCourses { get; set; }
    public int TotalEnrollments { get; set; }
    public int ActiveSections { get; set; }
    public int TotalDepartments { get; set; }
}

// API Response wrapper
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
}

public class PaginatedResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
