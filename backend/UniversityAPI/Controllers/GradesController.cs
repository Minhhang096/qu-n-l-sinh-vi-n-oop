using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UniversityAPI.DTOs;
using UniversityAPI.Services;

namespace UniversityAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradesController : ControllerBase
{
    private readonly IGradeService _gradeService;

    public GradesController(IGradeService gradeService)
    {
        _gradeService = gradeService;
    }

    [HttpGet("enrollment/{enrollmentId}")]
    public async Task<ActionResult<ApiResponse<GradeDto>>> GetGradeByEnrollment(int enrollmentId)
    {
        var grade = await _gradeService.GetGradeByEnrollmentIdAsync(enrollmentId);
        if (grade == null)
        {
            return NotFound(new ApiResponse<GradeDto> { Success = false, Message = "Grade not found" });
        }
        return Ok(new ApiResponse<GradeDto> { Success = true, Data = grade });
    }

    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<ApiResponse<List<GradeDto>>>> GetGradesByStudent(string studentId)
    {
        var grades = await _gradeService.GetGradesByStudentIdAsync(studentId);
        return Ok(new ApiResponse<List<GradeDto>> { Success = true, Data = grades });
    }

    [Authorize(Roles = "Admin,Department,Teacher")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<GradeDto>>> UpdateGrade([FromBody] UpdateGradeRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "system";
        var result = await _gradeService.UpdateGradeAsync(request, userId);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
