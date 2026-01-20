using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Models;

namespace UniversityAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly UniversityDbContext _context;

    public StudentsController(UniversityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<StudentDto>>>> GetStudents(
        [FromQuery] string? deptId = null,
        [FromQuery] string? classId = null,
        [FromQuery] string? status = null)
    {
        var query = _context.Students
            .Include(s => s.Department)
            .Include(s => s.Class)
            .AsQueryable();

        if (!string.IsNullOrEmpty(deptId))
            query = query.Where(s => s.DeptId == deptId);

        if (!string.IsNullOrEmpty(classId))
            query = query.Where(s => s.ClassId == classId);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(s => s.Status == status);

        var students = await query.Select(s => new StudentDto
        {
            StudentId = s.StudentId,
            Fullname = s.Fullname,
            Dob = s.Dob,
            Email = s.Email,
            DeptId = s.DeptId,
            DeptName = s.Department!.DeptName,
            Status = s.Status,
            ClassId = s.ClassId,
            ClassName = s.Class!.ClassName,
            AccountId = s.AccountId
        }).ToListAsync();

        return Ok(new ApiResponse<List<StudentDto>> { Success = true, Data = students });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<StudentDto>>> GetStudent(string id)
    {
        var student = await _context.Students
            .Include(s => s.Department)
            .Include(s => s.Class)
            .Where(s => s.StudentId == id)
            .Select(s => new StudentDto
            {
                StudentId = s.StudentId,
                Fullname = s.Fullname,
                Dob = s.Dob,
                Email = s.Email,
                DeptId = s.DeptId,
                DeptName = s.Department!.DeptName,
                Status = s.Status,
                ClassId = s.ClassId,
                ClassName = s.Class!.ClassName,
                AccountId = s.AccountId
            })
            .FirstOrDefaultAsync();

        if (student == null)
        {
            return NotFound(new ApiResponse<StudentDto> { Success = false, Message = "Student not found" });
        }

        return Ok(new ApiResponse<StudentDto> { Success = true, Data = student });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<StudentDto>>> CreateStudent([FromBody] CreateStudentRequest request)
    {
        if (await _context.Students.AnyAsync(s => s.StudentId == request.StudentId))
        {
            return BadRequest(new ApiResponse<StudentDto> { Success = false, Message = "Student ID already exists" });
        }

        var student = new Student
        {
            StudentId = request.StudentId,
            Fullname = request.Fullname,
            Dob = request.Dob,
            Email = request.Email,
            DeptId = request.DeptId,
            Status = request.Status,
            ClassId = request.ClassId
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<StudentDto>
        {
            Success = true,
            Message = "Student created successfully",
            Data = new StudentDto
            {
                StudentId = student.StudentId,
                Fullname = student.Fullname,
                Dob = student.Dob,
                Email = student.Email,
                DeptId = student.DeptId,
                Status = student.Status,
                ClassId = student.ClassId
            }
        });
    }

    [Authorize(Roles = "Admin,Department")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<StudentDto>>> UpdateStudent(string id, [FromBody] CreateStudentRequest request)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
        {
            return NotFound(new ApiResponse<StudentDto> { Success = false, Message = "Student not found" });
        }

        student.Fullname = request.Fullname;
        student.Dob = request.Dob;
        student.Email = request.Email;
        student.DeptId = request.DeptId;
        student.Status = request.Status;
        student.ClassId = request.ClassId;

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<StudentDto>
        {
            Success = true,
            Message = "Student updated successfully",
            Data = new StudentDto
            {
                StudentId = student.StudentId,
                Fullname = student.Fullname,
                Dob = student.Dob,
                Email = student.Email,
                DeptId = student.DeptId,
                Status = student.Status,
                ClassId = student.ClassId
            }
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteStudent(string id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
        {
            return NotFound(new ApiResponse<object> { Success = false, Message = "Student not found" });
        }

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<object> { Success = true, Message = "Student deleted successfully" });
    }
}
