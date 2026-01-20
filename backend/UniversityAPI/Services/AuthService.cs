using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using UniversityAPI.Data;
using UniversityAPI.DTOs;
using UniversityAPI.Models;

namespace UniversityAPI.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<ApiResponse<UserDto>> RegisterAsync(RegisterRequest request);
    Task<UserDto?> GetUserByIdAsync(int accountId);
    Task<List<UserDto>> GetAllUsersAsync();
}

public class AuthService : IAuthService
{
    private readonly UniversityDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(UniversityDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        try
        {
            var account = await _context.Accounts
                .Include(a => a.Student)
                    .ThenInclude(s => s!.Department)
                .Include(a => a.Student)
                    .ThenInclude(s => s!.Class)
                .Include(a => a.Teacher)
                    .ThenInclude(t => t!.Department)
                .FirstOrDefaultAsync(a => a.Username == request.Username);

            if (account == null)
            {
                return new LoginResponse { Success = false, Message = "Người dùng không tồn tại" };
            }

            if (account.IsLocked)
            {
                return new LoginResponse { Success = false, Message = "Tài khoản bị khóa" };
            }

            // Verify password (plain text comparison)
            if (account.Password != request.Password)
            {
                return new LoginResponse { Success = false, Message = "Mật khẩu không đúng" };
            }

            // Generate JWT token
            var token = GenerateJwtToken(account);

            var userDto = MapToUserDto(account);

            return new LoginResponse
            {
                Success = true,
                Message = "Đăng nhập thành công",
                Token = token,
                User = userDto
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Login error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return new LoginResponse { Success = false, Message = $"Lỗi: {ex.Message}" };
        }
    }

    public async Task<ApiResponse<UserDto>> RegisterAsync(RegisterRequest request)
    {
        // Check if username exists
        if (await _context.Accounts.AnyAsync(a => a.Username == request.Username))
        {
            return new ApiResponse<UserDto> { Success = false, Message = "Username already exists" };
        }

        // Check if email exists
        if (await _context.Accounts.AnyAsync(a => a.Email == request.Email))
        {
            return new ApiResponse<UserDto> { Success = false, Message = "Email already exists" };
        }

        var account = new Account
        {
            Username = request.Username,
            Password = request.Password,
            Email = request.Email,
            FullName = request.FullName,
            Role = request.Role,
            IsLocked = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();

        return new ApiResponse<UserDto>
        {
            Success = true,
            Message = "Registration successful",
            Data = MapToUserDto(account)
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(int accountId)
    {
        var account = await _context.Accounts
            .Include(a => a.Student)
                .ThenInclude(s => s!.Department)
            .Include(a => a.Student)
                .ThenInclude(s => s!.Class)
            .Include(a => a.Teacher)
                .ThenInclude(t => t!.Department)
            .FirstOrDefaultAsync(a => a.AccountId == accountId);

        return account == null ? null : MapToUserDto(account);
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        var accounts = await _context.Accounts
            .Include(a => a.Student)
                .ThenInclude(s => s!.Department)
            .Include(a => a.Student)
                .ThenInclude(s => s!.Class)
            .Include(a => a.Teacher)
                .ThenInclude(t => t!.Department)
            .ToListAsync();

        return accounts.Select(MapToUserDto).ToList();
    }

    private string GenerateJwtToken(Account account)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIs32BytesLong!"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, account.AccountId.ToString()),
            new Claim(ClaimTypes.Name, account.Username),
            new Claim(ClaimTypes.Role, account.Role),
            new Claim(ClaimTypes.Email, account.Email ?? "")
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private UserDto MapToUserDto(Account account)
    {
        return new UserDto
        {
            AccountId = account.AccountId,
            Username = account.Username,
            Role = account.Role,
            FullName = account.FullName,
            Email = account.Email,
            IsLocked = account.IsLocked,
            CreatedAt = account.CreatedAt,
            Student = account.Student != null ? new StudentDto
            {
                StudentId = account.Student.StudentId,
                Fullname = account.Student.Fullname,
                Dob = account.Student.Dob,
                Email = account.Student.Email,
                DeptId = account.Student.DeptId,
                DeptName = account.Student.Department?.DeptName,
                Status = account.Student.Status,
                ClassId = account.Student.ClassId,
                ClassName = account.Student.Class?.ClassName
            } : null,
            Teacher = account.Teacher != null ? new TeacherDto
            {
                TeacherId = account.Teacher.TeacherId,
                FullName = account.Teacher.FullName,
                Email = account.Teacher.Email,
                DeptId = account.Teacher.DeptId,
                DeptName = account.Teacher.Department?.DeptName,
                Status = account.Teacher.Status
            } : null
        };
    }
}
