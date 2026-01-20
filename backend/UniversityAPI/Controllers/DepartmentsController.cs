using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Models;

namespace UniversityAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly UniversityDbContext _context;

    public DepartmentsController(UniversityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<DepartmentDto>>>> GetDepartments()
    {
        var departments = await _context.Departments
            .Include(d => d.Students)
            .Include(d => d.Teachers)
            .Include(d => d.Courses)
            .Select(d => new DepartmentDto
            {
                DeptId = d.DeptId,
                DeptName = d.DeptName,
                StudentCount = d.Students.Count,
                TeacherCount = d.Teachers.Count,
                CourseCount = d.Courses.Count
            })
            .ToListAsync();

        return Ok(new ApiResponse<List<DepartmentDto>> { Success = true, Data = departments });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<DepartmentDto>>> GetDepartment(string id)
    {
        var department = await _context.Departments
            .Include(d => d.Students)
            .Include(d => d.Teachers)
            .Include(d => d.Courses)
            .Where(d => d.DeptId == id)
            .Select(d => new DepartmentDto
            {
                DeptId = d.DeptId,
                DeptName = d.DeptName,
                StudentCount = d.Students.Count,
                TeacherCount = d.Teachers.Count,
                CourseCount = d.Courses.Count
            })
            .FirstOrDefaultAsync();

        if (department == null)
        {
            return NotFound(new ApiResponse<DepartmentDto> { Success = false, Message = "Department not found" });
        }

        return Ok(new ApiResponse<DepartmentDto> { Success = true, Data = department });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<DepartmentDto>>> CreateDepartment([FromBody] CreateDepartmentRequest request)
    {
        if (await _context.Departments.AnyAsync(d => d.DeptId == request.DeptId))
        {
            return BadRequest(new ApiResponse<DepartmentDto> { Success = false, Message = "Department ID already exists" });
        }

        var department = new Department
        {
            DeptId = request.DeptId,
            DeptName = request.DeptName
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<DepartmentDto>
        {
            Success = true,
            Message = "Department created successfully",
            Data = new DepartmentDto { DeptId = department.DeptId, DeptName = department.DeptName }
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<DepartmentDto>>> UpdateDepartment(string id, [FromBody] CreateDepartmentRequest request)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null)
        {
            return NotFound(new ApiResponse<DepartmentDto> { Success = false, Message = "Department not found" });
        }

        department.DeptName = request.DeptName;
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<DepartmentDto>
        {
            Success = true,
            Message = "Department updated successfully",
            Data = new DepartmentDto { DeptId = department.DeptId, DeptName = department.DeptName }
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteDepartment(string id)
    {
        var department = await _context.Departments
            .Include(d => d.Students)
            .Include(d => d.Teachers)
            .FirstOrDefaultAsync(d => d.DeptId == id);

        if (department == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Department not found" });
        }

        if (department.Students.Any() || department.Teachers.Any())
        {
            return BadRequest(new ApiResponse<object> { Success = false, Message = "Cannot delete department with associated students or teachers" });
        }

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Success = true, Message = "Department deleted successfully" });
    }
}
