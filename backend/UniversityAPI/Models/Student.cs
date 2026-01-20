using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityAPI.Models;

public enum StudentStatus
{
    Active,
    OnLeave,
    Graduated,
    Suspended
}

[Table("students")]
public class Student
{
    [Key]
    [Column("student_id")]
    [StringLength(20)]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    [Column("fullname")]
    [StringLength(100)]
    public string Fullname { get; set; } = string.Empty;

    [Column("dob")]
    public DateTime? Dob { get; set; }

    [Column("email")]
    [StringLength(100)]
    public string? Email { get; set; }

    [Required]
    [Column("dept_id")]
    [StringLength(10)]
    public string DeptId { get; set; } = string.Empty;

    [Column("status")]
    [StringLength(20)]
    public string Status { get; set; } = "Active";

    [Required]
    [Column("class_id")]
    [StringLength(20)]
    public string ClassId { get; set; } = string.Empty;

    [Column("account_id")]
    public int? AccountId { get; set; }

    // Navigation properties
    [ForeignKey("DeptId")]
    public virtual Department? Department { get; set; }

    [ForeignKey("ClassId")]
    public virtual Class? Class { get; set; }

    [ForeignKey("AccountId")]
    public virtual Account? Account { get; set; }

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
