using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Models;

namespace UniversityAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentsController : ControllerBase
{
    private readonly UniversityDbContext _context;

    public EnrollmentsController(UniversityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<EnrollmentDto>>>> GetEnrollments(
        [FromQuery] string? studentId = null,
        [FromQuery] int? sectionId = null,
        [FromQuery] string? status = null)
    {
        var query = _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Section)
                .ThenInclude(s => s!.Course)
            .Include(e => e.Grade)
            .AsQueryable();

        if (!string.IsNullOrEmpty(studentId))
            query = query.Where(e => e.StudentId == studentId);

        if (sectionId.HasValue)
            query = query.Where(e => e.SectionId == sectionId.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(e => e.Status == status);

        var enrollments = await query.Select(e => new EnrollmentDto
        {
            EnrollmentId = e.EnrollmentId,
            StudentId = e.StudentId,
            StudentName = e.Student!.Fullname,
            SectionId = e.SectionId,
            CourseName = e.Section!.Course!.CourseName,
            Semester = e.Section.Semester,
            EnrollDate = e.EnrollDate,
            Status = e.Status,
            Grade = e.Grade != null ? new GradeDto
            {
                GradeId = e.Grade.GradeId,
                EnrollmentId = e.Grade.EnrollmentId,
                Midterm = e.Grade.Midterm,
                Final = e.Grade.Final,
                Other = e.Grade.Other,
                GpaPoint = e.Grade.GpaPoint,
                LetterGrade = e.Grade.LetterGrade,
                UpdatedAt = e.Grade.UpdatedAt,
                UpdatedBy = e.Grade.UpdatedBy
            } : null
        }).ToListAsync();

        return Ok(new ApiResponse<List<EnrollmentDto>> { Success = true, Data = enrollments });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<EnrollmentDto>>> GetEnrollment(int id)
    {
        var enrollment = await _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Section)
                .ThenInclude(s => s!.Course)
            .Include(e => e.Grade)
            .Where(e => e.EnrollmentId == id)
            .Select(e => new EnrollmentDto
            {
                EnrollmentId = e.EnrollmentId,
                StudentId = e.StudentId,
                StudentName = e.Student!.Fullname,
                SectionId = e.SectionId,
                CourseName = e.Section!.Course!.CourseName,
                Semester = e.Section.Semester,
                EnrollDate = e.EnrollDate,
                Status = e.Status,
                Grade = e.Grade != null ? new GradeDto
                {
                    GradeId = e.Grade.GradeId,
                    EnrollmentId = e.Grade.EnrollmentId,
                    Midterm = e.Grade.Midterm,
                    Final = e.Grade.Final,
                    Other = e.Grade.Other,
                    GpaPoint = e.Grade.GpaPoint,
                    LetterGrade = e.Grade.LetterGrade,
                    UpdatedAt = e.Grade.UpdatedAt,
                    UpdatedBy = e.Grade.UpdatedBy
                } : null
            })
            .FirstOrDefaultAsync();

        if (enrollment == null)
        {
            return NotFound(new ApiResponse<EnrollmentDto> { Success = false, Message = "Enrollment not found" });
        }

        return Ok(new ApiResponse<EnrollmentDto> { Success = true, Data = enrollment });
    }

    [Authorize(Roles = "Admin,Department,Student")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<EnrollmentDto>>> CreateEnrollment([FromBody] CreateEnrollmentRequest request)
    {
        // Verify student exists
        if (!await _context.Students.AnyAsync(s => s.StudentId == request.StudentId))
        {
            return BadRequest(new ApiResponse<EnrollmentDto> { Success = false, Message = "Student not found" });
        }

        // Verify section exists and is open
        var section = await _context.Sections
            .Include(s => s.Enrollments)
            .FirstOrDefaultAsync(s => s.SectionId == request.SectionId);

        if (section == null)
        {
            return BadRequest(new ApiResponse<EnrollmentDto> { Success = false, Message = "Section not found" });
        }

        if (section.Status != "Open")
        {
            return BadRequest(new ApiResponse<EnrollmentDto> { Success = false, Message = "Section is not open for enrollment" });
        }

        // Check capacity
        if (section.Enrollments.Count >= section.Capacity)
        {
            return BadRequest(new ApiResponse<EnrollmentDto> { Success = false, Message = "Section is full" });
        }

        // Check if already enrolled
        if (await _context.Enrollments.AnyAsync(e => e.StudentId == request.StudentId && e.SectionId == request.SectionId))
        {
            return BadRequest(new ApiResponse<EnrollmentDto> { Success = false, Message = "Student is already enrolled in this section" });
        }

        var enrollment = new Enrollment
        {
            StudentId = request.StudentId,
            SectionId = request.SectionId,
            EnrollDate = DateTime.UtcNow,
            Status = "Enrolled"
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<EnrollmentDto>
        {
            Success = true,
            Message = "Enrollment created successfully",
            Data = new EnrollmentDto
            {
                EnrollmentId = enrollment.EnrollmentId,
                StudentId = enrollment.StudentId,
                SectionId = enrollment.SectionId,
                EnrollDate = enrollment.EnrollDate,
                Status = enrollment.Status
            }
        });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse<EnrollmentDto>>> UpdateEnrollmentStatus(int id, [FromBody] string status)
    {
        var enrollment = await _context.Enrollments.FindAsync(id);
        if (enrollment == null)
        {
            return NotFound(new ApiResponse<EnrollmentDto> { Success = false, Message = "Enrollment not found" });
        }

        enrollment.Status = status;
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<EnrollmentDto>
        {
            Success = true,
            Message = "Enrollment status updated",
            Data = new EnrollmentDto
            {
                EnrollmentId = enrollment.EnrollmentId,
                Status = enrollment.Status
            }
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteEnrollment(int id)
    {
        var enrollment = await _context.Enrollments
            .Include(e => e.Grade)
            .FirstOrDefaultAsync(e => e.EnrollmentId == id);

        if (enrollment == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Enrollment not found" });
        }

        // Delete associated grade first
        if (enrollment.Grade != null)
        {
            _context.Grades.Remove(enrollment.Grade);
        }

        _context.Enrollments.Remove(enrollment);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Success = true, Message = "Enrollment deleted successfully" });
    }
}
