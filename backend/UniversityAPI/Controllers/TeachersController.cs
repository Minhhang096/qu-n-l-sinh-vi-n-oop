using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Models;

namespace UniversityAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeachersController : ControllerBase
{
    private readonly UniversityDbContext _context;

    public TeachersController(UniversityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TeacherDto>>>> GetTeachers([FromQuery] string? deptId = null)
    {
        var query = _context.Teachers
            .Include(t => t.Department)
            .Include(t => t.Sections)
            .AsQueryable();

        if (!string.IsNullOrEmpty(deptId))
            query = query.Where(t => t.DeptId == deptId);

        var teachers = await query.Select(t => new TeacherDto
        {
            TeacherId = t.TeacherId,
            FullName = t.FullName,
            Email = t.Email,
            DeptId = t.DeptId,
            DeptName = t.Department!.DeptName,
            Status = t.Status,
            AccountId = t.AccountId,
            SectionCount = t.Sections.Count
        }).ToListAsync();

        return Ok(new ApiResponse<List<TeacherDto>> { Success = true, Data = teachers });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TeacherDto>>> GetTeacher(string id)
    {
        var teacher = await _context.Teachers
            .Include(t => t.Department)
            .Include(t => t.Sections)
            .Where(t => t.TeacherId == id)
            .Select(t => new TeacherDto
            {
                TeacherId = t.TeacherId,
                FullName = t.FullName,
                Email = t.Email,
                DeptId = t.DeptId,
                DeptName = t.Department!.DeptName,
                Status = t.Status,
                AccountId = t.AccountId,
                SectionCount = t.Sections.Count
            })
            .FirstOrDefaultAsync();

        if (teacher == null)
        {
            return NotFound(new ApiResponse<TeacherDto> { Success = false, Message = "Teacher not found" });
        }

        return Ok(new ApiResponse<TeacherDto> { Success = true, Data = teacher });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<TeacherDto>>> CreateTeacher([FromBody] CreateTeacherRequest request)
    {
        if (await _context.Teachers.AnyAsync(t => t.TeacherId == request.TeacherId))
        {
            return BadRequest(new ApiResponse<TeacherDto> { Success = false, Message = "Teacher ID already exists" });
        }

        var teacher = new Teacher
        {
            TeacherId = request.TeacherId,
            FullName = request.FullName,
            Email = request.Email,
            DeptId = request.DeptId,
            Status = request.Status
        };

        _context.Teachers.Add(teacher);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<TeacherDto>
        {
            Success = true,
            Message = "Teacher created successfully",
            Data = new TeacherDto
            {
                TeacherId = teacher.TeacherId,
                FullName = teacher.FullName,
                Email = teacher.Email,
                DeptId = teacher.DeptId,
                Status = teacher.Status
            }
        });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<TeacherDto>>> UpdateTeacher(string id, [FromBody] CreateTeacherRequest request)
    {
        var teacher = await _context.Teachers.FindAsync(id);
        if (teacher == null)
        {
            return NotFound(new ApiResponse<TeacherDto> { Success = false, Message = "Teacher not found" });
        }

        teacher.FullName = request.FullName;
        teacher.Email = request.Email;
        teacher.DeptId = request.DeptId;
        teacher.Status = request.Status;

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<TeacherDto>
        {
            Success = true,
            Message = "Teacher updated successfully",
            Data = new TeacherDto
            {
                TeacherId = teacher.TeacherId,
                FullName = teacher.FullName,
                Email = teacher.Email,
                DeptId = teacher.DeptId,
                Status = teacher.Status
            }
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteTeacher(string id)
    {
        var teacher = await _context.Teachers
            .Include(t => t.Sections)
            .FirstOrDefaultAsync(t => t.TeacherId == id);

        if (teacher == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Teacher not found" });
        }

        if (teacher.Sections.Any())
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = "Cannot delete teacher with assigned sections" });
        }

        _context.Teachers.Remove(teacher);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Success = true, Message = "Teacher deleted successfully" });
    }
}
