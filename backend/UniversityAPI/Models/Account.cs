using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityAPI.Models;

public enum UserRole
{
    Admin,
    Department,
    Teacher,
    Student
}

[Table("accounts")]
public class Account
{
    [Key]
    [Column("account_id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AccountId { get; set; }

    [Required]
    [Column("username")]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [Column("password")]
    [StringLength(255)]
    public string Password { get; set; } = string.Empty;

    [Column("is_locked")]
    public bool IsLocked { get; set; } = false;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("role")]
    [StringLength(20)]
    public string Role { get; set; } = "Student";

    [Column("full_name")]
    [StringLength(100)]
    public string? FullName { get; set; }

    [Column("email")]
    [StringLength(100)]
    public string? Email { get; set; }

    // Navigation properties
    public virtual Student? Student { get; set; }
    public virtual Teacher? Teacher { get; set; }
}
