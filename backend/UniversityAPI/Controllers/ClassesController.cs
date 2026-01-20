using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Models;

namespace UniversityAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassesController : ControllerBase
{
    private readonly UniversityDbContext _context;

    public ClassesController(UniversityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ClassDto>>>> GetClasses([FromQuery] string? deptId = null)
    {
        var query = _context.Classes
            .Include(c => c.Department)
            .Include(c => c.Students)
            .AsQueryable();

        if (!string.IsNullOrEmpty(deptId))
            query = query.Where(c => c.DeptId == deptId);

        var classes = await query.Select(c => new ClassDto
        {
            ClassId = c.ClassId,
            ClassName = c.ClassName,
            DeptId = c.DeptId,
            DeptName = c.Department!.DeptName,
            CohortYear = c.CohortYear,
            StudentCount = c.Students.Count
        }).ToListAsync();

        return Ok(new ApiResponse<List<ClassDto>> { Success = true, Data = classes });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ClassDto>>> GetClass(string id)
    {
        var classEntity = await _context.Classes
            .Include(c => c.Department)
            .Include(c => c.Students)
            .Where(c => c.ClassId == id)
            .Select(c => new ClassDto
            {
                ClassId = c.ClassId,
                ClassName = c.ClassName,
                DeptId = c.DeptId,
                DeptName = c.Department!.DeptName,
                CohortYear = c.CohortYear,
                StudentCount = c.Students.Count
            })
            .FirstOrDefaultAsync();

        if (classEntity == null)
        {
            return NotFound(new ApiResponse<ClassDto> { Success = false, Message = "Class not found" });
        }

        return Ok(new ApiResponse<ClassDto> { Success = true, Data = classEntity });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ClassDto>>> CreateClass([FromBody] CreateClassRequest request)
    {
        if (await _context.Classes.AnyAsync(c => c.ClassId == request.ClassId))
        {
            return BadRequest(new ApiResponse<ClassDto> { Success = false, Message = "Class ID already exists" });
        }

        var classEntity = new Class
        {
            ClassId = request.ClassId,
            ClassName = request.ClassName,
            DeptId = request.DeptId,
            CohortYear = request.CohortYear
        };

        _context.Classes.Add(classEntity);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<ClassDto>
        {
            Success = true,
            Message = "Class created successfully",
            Data = new ClassDto
            {
                ClassId = classEntity.ClassId,
                ClassName = classEntity.ClassName,
                DeptId = classEntity.DeptId,
                CohortYear = classEntity.CohortYear
            }
        });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ClassDto>>> UpdateClass(string id, [FromBody] CreateClassRequest request)
    {
        var classEntity = await _context.Classes.FindAsync(id);
        if (classEntity == null)
        {
            return NotFound(new ApiResponse<ClassDto> { Success = false, Message = "Class not found" });
        }

        classEntity.ClassName = request.ClassName;
        classEntity.DeptId = request.DeptId;
        classEntity.CohortYear = request.CohortYear;

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<ClassDto>
        {
            Success = true,
            Message = "Class updated successfully",
            Data = new ClassDto
            {
                ClassId = classEntity.ClassId,
                ClassName = classEntity.ClassName,
                DeptId = classEntity.DeptId,
                CohortYear = classEntity.CohortYear
            }
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteClass(string id)
    {
        var classEntity = await _context.Classes
            .Include(c => c.Students)
            .FirstOrDefaultAsync(c => c.ClassId == id);

        if (classEntity == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Class not found" });
        }

        if (classEntity.Students.Any())
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = "Cannot delete class with students" });
        }

        _context.Classes.Remove(classEntity);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Success = true, Message = "Class deleted successfully" });
    }
}
