using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityAPI.Models;

public enum TeacherStatus
{
    Active,
    Inactive
}

[Table("teachers")]
public class Teacher
{
    [Key]
    [Column("teacher_id")]
    [StringLength(20)]
    public string TeacherId { get; set; } = string.Empty;

    [Required]
    [Column("full_name")]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Column("email")]
    [StringLength(100)]
    public string? Email { get; set; }

    [Required]
    [Column("dept_id")]
    [StringLength(10)]
    public string DeptId { get; set; } = string.Empty;

    [Column("account_id")]
    public int? AccountId { get; set; }

    [Column("status")]
    [StringLength(20)]
    public string Status { get; set; } = "Active";

    // Navigation properties
    [ForeignKey("DeptId")]
    public virtual Department? Department { get; set; }

    [ForeignKey("AccountId")]
    public virtual Account? Account { get; set; }

    public virtual ICollection<Section> Sections { get; set; } = new List<Section>();
}
