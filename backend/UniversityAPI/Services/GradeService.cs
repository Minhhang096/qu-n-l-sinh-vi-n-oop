using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Models;

namespace UniversityAPI.Services;

public interface IGradeService
{
    Task<GradeDto?> GetGradeByEnrollmentIdAsync(int enrollmentId);
    Task<List<GradeDto>> GetGradesByStudentIdAsync(string studentId);
    Task<ApiResponse<GradeDto>> UpdateGradeAsync(UpdateGradeRequest request, string updatedBy);
    decimal CalculateGpaPoint(decimal? midterm, decimal? final, decimal? other);
    string CalculateLetterGrade(decimal gpaPoint);
}

public class GradeService : IGradeService
{
    private readonly UniversityDbContext _context;

    public GradeService(UniversityDbContext context)
    {
        _context = context;
    }

    public async Task<GradeDto?> GetGradeByEnrollmentIdAsync(int enrollmentId)
    {
        var grade = await _context.Grades
            .FirstOrDefaultAsync(g => g.EnrollmentId == enrollmentId);

        return grade == null ? null : MapToDto(grade);
    }

    public async Task<List<GradeDto>> GetGradesByStudentIdAsync(string studentId)
    {
        var grades = await _context.Grades
            .Include(g => g.Enrollment)
            .Where(g => g.Enrollment!.StudentId == studentId)
            .ToListAsync();

        return grades.Select(MapToDto).ToList();
    }

    public async Task<ApiResponse<GradeDto>> UpdateGradeAsync(UpdateGradeRequest request, string updatedBy)
    {
        // Check if enrollment exists
        var enrollment = await _context.Enrollments
            .Include(e => e.Section)
            .FirstOrDefaultAsync(e => e.EnrollmentId == request.EnrollmentId);

        if (enrollment == null)
        {
            return new ApiResponse<GradeDto> { Success = false, Message = "Enrollment not found" };
        }

        // Check if grade is locked
        if (enrollment.Section?.IsGradeLocked == true)
        {
            return new ApiResponse<GradeDto> { Success = false, Message = "Grades are locked for this section" };
        }

        var grade = await _context.Grades
            .FirstOrDefaultAsync(g => g.EnrollmentId == request.EnrollmentId);

        if (grade == null)
        {
            // Create new grade
            grade = new Grade
            {
                EnrollmentId = request.EnrollmentId
            };
            _context.Grades.Add(grade);
        }

        // Update scores
        grade.Midterm = request.Midterm;
        grade.Final = request.Final;
        grade.Other = request.Other;

        // Calculate GPA point and letter grade
        grade.GpaPoint = CalculateGpaPoint(request.Midterm, request.Final, request.Other);
        grade.LetterGrade = CalculateLetterGrade(grade.GpaPoint ?? 0);
        grade.UpdatedAt = DateTime.UtcNow;
        grade.UpdatedBy = updatedBy;

        await _context.SaveChangesAsync();

        return new ApiResponse<GradeDto>
        {
            Success = true,
            Message = "Grade updated successfully",
            Data = MapToDto(grade)
        };
    }

    public decimal CalculateGpaPoint(decimal? midterm, decimal? final, decimal? other)
    {
        // Weight: Midterm 30%, Final 50%, Other 20%
        var mid = midterm ?? 0;
        var fin = final ?? 0;
        var oth = other ?? 0;

        var totalScore = (mid * 0.3m) + (fin * 0.5m) + (oth * 0.2m);

        // Convert to 4.0 scale
        if (totalScore >= 90) return 4.0m;
        if (totalScore >= 85) return 3.7m;
        if (totalScore >= 80) return 3.3m;
        if (totalScore >= 75) return 3.0m;
        if (totalScore >= 70) return 2.7m;
        if (totalScore >= 65) return 2.3m;
        if (totalScore >= 60) return 2.0m;
        if (totalScore >= 55) return 1.7m;
        if (totalScore >= 50) return 1.0m;
        return 0.0m;
    }

    public string CalculateLetterGrade(decimal gpaPoint)
    {
        if (gpaPoint >= 4.0m) return "A";
        if (gpaPoint >= 3.7m) return "A-";
        if (gpaPoint >= 3.3m) return "B+";
        if (gpaPoint >= 3.0m) return "B";
        if (gpaPoint >= 2.7m) return "B-";
        if (gpaPoint >= 2.3m) return "C+";
        if (gpaPoint >= 2.0m) return "C";
        if (gpaPoint >= 1.7m) return "C-";
        if (gpaPoint >= 1.0m) return "D";
        return "F";
    }

    private GradeDto MapToDto(Grade grade)
    {
        return new GradeDto
        {
            GradeId = grade.GradeId,
            EnrollmentId = grade.EnrollmentId,
            Midterm = grade.Midterm,
            Final = grade.Final,
            Other = grade.Other,
            GpaPoint = grade.GpaPoint,
            LetterGrade = grade.LetterGrade,
            UpdatedAt = grade.UpdatedAt,
            UpdatedBy = grade.UpdatedBy
        };
    }
}
