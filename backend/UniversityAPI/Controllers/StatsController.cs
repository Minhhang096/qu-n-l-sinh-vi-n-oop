using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniversityAPI.Data;
using UniversityAPI.DTOs;

namespace UniversityAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly UniversityDbContext _context;

    public StatsController(UniversityDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetDashboardStats()
    {
        var stats = new DashboardStatsDto
        {
            TotalStudents = await _context.Students.CountAsync(),
            TotalTeachers = await _context.Teachers.CountAsync(),
            TotalCourses = await _context.Courses.CountAsync(),
            TotalEnrollments = await _context.Enrollments.CountAsync(),
            ActiveSections = await _context.Sections.CountAsync(s => s.Status == "Open"),
            TotalDepartments = await _context.Departments.CountAsync()
        };

        return Ok(new ApiResponse<DashboardStatsDto> { Success = true, Data = stats });
    }

    [HttpGet("department/{deptId}")]
    public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetDepartmentStats(string deptId)
    {
        var stats = new DashboardStatsDto
        {
            TotalStudents = await _context.Students.CountAsync(s => s.DeptId == deptId),
            TotalTeachers = await _context.Teachers.CountAsync(t => t.DeptId == deptId),
            TotalCourses = await _context.Courses.CountAsync(c => c.DeptId == deptId),
            TotalEnrollments = await _context.Enrollments
                .Include(e => e.Student)
                .CountAsync(e => e.Student!.DeptId == deptId),
            ActiveSections = await _context.Sections
                .Include(s => s.Course)
                .CountAsync(s => s.Course!.DeptId == deptId && s.Status == "Open")
        };

        return Ok(new ApiResponse<DashboardStatsDto> { Success = true, Data = stats });
    }
}
