using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Models;

namespace UniversityAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly UniversityDbContext _context;

    public CoursesController(UniversityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<CourseDto>>>> GetCourses([FromQuery] string? deptId = null)
    {
        var query = _context.Courses
            .Include(c => c.Department)
            .Include(c => c.Sections)
            .AsQueryable();

        if (!string.IsNullOrEmpty(deptId))
            query = query.Where(c => c.DeptId == deptId);

        var courses = await query.Select(c => new CourseDto
        {
            CourseId = c.CourseId,
            CourseName = c.CourseName,
            Credits = c.Credits,
            DeptId = c.DeptId,
            DeptName = c.Department!.DeptName,
            Description = c.Description,
            SectionCount = c.Sections.Count
        }).ToListAsync();

        return Ok(new ApiResponse<List<CourseDto>> { Success = true, Data = courses });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CourseDto>>> GetCourse(string id)
    {
        var course = await _context.Courses
            .Include(c => c.Department)
            .Include(c => c.Sections)
            .Where(c => c.CourseId == id)
            .Select(c => new CourseDto
            {
                CourseId = c.CourseId,
                CourseName = c.CourseName,
                Credits = c.Credits,
                DeptId = c.DeptId,
                DeptName = c.Department!.DeptName,
                Description = c.Description,
                SectionCount = c.Sections.Count
            })
            .FirstOrDefaultAsync();

        if (course == null)
        {
            return NotFound(new ApiResponse<CourseDto> { Success = false, Message = "Course not found" });
        }

        return Ok(new ApiResponse<CourseDto> { Success = true, Data = course });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CourseDto>>> CreateCourse([FromBody] CreateCourseRequest request)
    {
        if (await _context.Courses.AnyAsync(c => c.CourseId == request.CourseId))
        {
            return BadRequest(new ApiResponse<CourseDto> { Success = false, Message = "Course ID already exists" });
        }

        var course = new Course
        {
            CourseId = request.CourseId,
            CourseName = request.CourseName,
            Credits = request.Credits,
            DeptId = request.DeptId,
            Description = request.Description
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<CourseDto>
        {
            Success = true,
            Message = "Course created successfully",
            Data = new CourseDto
            {
                CourseId = course.CourseId,
                CourseName = course.CourseName,
                Credits = course.Credits,
                DeptId = course.DeptId,
                Description = course.Description
            }
        });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CourseDto>>> UpdateCourse(string id, [FromBody] CreateCourseRequest request)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
        {
            return NotFound(new ApiResponse<CourseDto> { Success = false, Message = "Course not found" });
        }

        course.CourseName = request.CourseName;
        course.Credits = request.Credits;
        course.DeptId = request.DeptId;
        course.Description = request.Description;

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<CourseDto>
        {
            Success = true,
            Message = "Course updated successfully",
            Data = new CourseDto
            {
                CourseId = course.CourseId,
                CourseName = course.CourseName,
                Credits = course.Credits,
                DeptId = course.DeptId,
                Description = course.Description
            }
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteCourse(string id)
    {
        var course = await _context.Courses
            .Include(c => c.Sections)
            .FirstOrDefaultAsync(c => c.CourseId == id);

        if (course == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Course not found" });
        }

        if (course.Sections.Any())
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = "Cannot delete course with existing sections" });
        }

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Success = true, Message = "Course deleted successfully" });
    }
}
