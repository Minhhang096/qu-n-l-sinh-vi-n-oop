using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Models;

namespace UniversityAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SectionsController : ControllerBase
{
    private readonly UniversityDbContext _context;

    public SectionsController(UniversityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<SectionDto>>>> GetSections(
        [FromQuery] string? courseId = null,
        [FromQuery] string? teacherId = null,
        [FromQuery] string? semester = null,
        [FromQuery] string? status = null)
    {
        var query = _context.Sections
            .Include(s => s.Course)
            .Include(s => s.Teacher)
            .Include(s => s.Enrollments)
            .AsQueryable();

        if (!string.IsNullOrEmpty(courseId))
            query = query.Where(s => s.CourseId == courseId);

        if (!string.IsNullOrEmpty(teacherId))
            query = query.Where(s => s.TeacherId == teacherId);

        if (!string.IsNullOrEmpty(semester))
            query = query.Where(s => s.Semester == semester);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(s => s.Status == status);

        var sections = await query.Select(s => new SectionDto
        {
            SectionId = s.SectionId,
            CourseId = s.CourseId,
            CourseName = s.Course!.CourseName,
            Semester = s.Semester,
            TeacherId = s.TeacherId,
            TeacherName = s.Teacher!.FullName,
            Capacity = s.Capacity,
            EnrolledCount = s.Enrollments.Count,
            Status = s.Status,
            IsGradeLocked = s.IsGradeLocked,
            Schedule = s.Schedule,
            Room = s.Room
        }).ToListAsync();

        return Ok(new ApiResponse<List<SectionDto>> { Success = true, Data = sections });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<SectionDto>>> GetSection(int id)
    {
        var section = await _context.Sections
            .Include(s => s.Course)
            .Include(s => s.Teacher)
            .Include(s => s.Enrollments)
            .Where(s => s.SectionId == id)
            .Select(s => new SectionDto
            {
                SectionId = s.SectionId,
                CourseId = s.CourseId,
                CourseName = s.Course!.CourseName,
                Semester = s.Semester,
                TeacherId = s.TeacherId,
                TeacherName = s.Teacher!.FullName,
                Capacity = s.Capacity,
                EnrolledCount = s.Enrollments.Count,
                Status = s.Status,
                IsGradeLocked = s.IsGradeLocked,
                Schedule = s.Schedule,
                Room = s.Room
            })
            .FirstOrDefaultAsync();

        if (section == null)
        {
            return NotFound(new ApiResponse<SectionDto> { Success = false, Message = "Section not found" });
        }

        return Ok(new ApiResponse<SectionDto> { Success = true, Data = section });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<SectionDto>>> CreateSection([FromBody] CreateSectionRequest request)
    {
        // Verify course exists
        if (!await _context.Courses.AnyAsync(c => c.CourseId == request.CourseId))
        {
            return BadRequest(new ApiResponse<SectionDto> { Success = false, Message = "Course not found" });
        }

        // Verify teacher exists
        if (!await _context.Teachers.AnyAsync(t => t.TeacherId == request.TeacherId))
        {
            return BadRequest(new ApiResponse<SectionDto> { Success = false, Message = "Teacher not found" });
        }

        var section = new Section
        {
            CourseId = request.CourseId,
            Semester = request.Semester,
            TeacherId = request.TeacherId,
            Capacity = request.Capacity,
            Status = request.Status,
            Schedule = request.Schedule,
            Room = request.Room,
            IsGradeLocked = false
        };

        _context.Sections.Add(section);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<SectionDto>
        {
            Success = true,
            Message = "Section created successfully",
            Data = new SectionDto
            {
                SectionId = section.SectionId,
                CourseId = section.CourseId,
                Semester = section.Semester,
                TeacherId = section.TeacherId,
                Capacity = section.Capacity,
                Status = section.Status,
                Schedule = section.Schedule,
                Room = section.Room
            }
        });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<SectionDto>>> UpdateSection(int id, [FromBody] CreateSectionRequest request)
    {
        var section = await _context.Sections.FindAsync(id);
        if (section == null)
        {
            return NotFound(new ApiResponse<SectionDto> { Success = false, Message = "Section not found" });
        }

        section.CourseId = request.CourseId;
        section.Semester = request.Semester;
        section.TeacherId = request.TeacherId;
        section.Capacity = request.Capacity;
        section.Status = request.Status;
        section.Schedule = request.Schedule;
        section.Room = request.Room;

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<SectionDto>
        {
            Success = true,
            Message = "Section updated successfully",
            Data = new SectionDto
            {
                SectionId = section.SectionId,
                CourseId = section.CourseId,
                Semester = section.Semester,
                TeacherId = section.TeacherId,
                Capacity = section.Capacity,
                Status = section.Status,
                Schedule = section.Schedule,
                Room = section.Room
            }
        });
    }

    [Authorize(Roles = "Admin,Department,Teacher")]
    [HttpPatch("{id}/lock-grade")]
    public async Task<ActionResult<ApiResponse<SectionDto>>> ToggleGradeLock(int id)
    {
        var section = await _context.Sections.FindAsync(id);
        if (section == null)
        {
            return NotFound(new ApiResponse<SectionDto> { Success = false, Message = "Section not found" });
        }

        section.IsGradeLocked = !section.IsGradeLocked;
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<SectionDto>
        {
            Success = true,
            Message = section.IsGradeLocked ? "Grades locked" : "Grades unlocked",
            Data = new SectionDto
            {
                SectionId = section.SectionId,
                IsGradeLocked = section.IsGradeLocked
            }
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteSection(int id)
    {
        var section = await _context.Sections
            .Include(s => s.Enrollments)
            .FirstOrDefaultAsync(s => s.SectionId == id);

        if (section == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Section not found" });
        }

        if (section.Enrollments.Any())
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = "Cannot delete section with enrollments" });
        }

        _context.Sections.Remove(section);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Success = true, Message = "Section deleted successfully" });
    }
}
