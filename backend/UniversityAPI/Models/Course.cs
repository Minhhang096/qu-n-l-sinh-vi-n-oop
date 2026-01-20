using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityAPI.Models;

[Table("courses")]
public class Course
{
    [Key]
    [Column("course_id")]
    [StringLength(20)]
    public string CourseId { get; set; } = string.Empty;

    [Required]
    [Column("course_name")]
    [StringLength(100)]
    public string CourseName { get; set; } = string.Empty;

    [Required]
    [Column("credits")]
    public int Credits { get; set; }

    [Required]
    [Column("dept_id")]
    [StringLength(10)]
    public string DeptId { get; set; } = string.Empty;

    [Column("description")]
    [StringLength(500)]
    public string? Description { get; set; }

    // Navigation properties
    [ForeignKey("DeptId")]
    public virtual Department? Department { get; set; }

    public virtual ICollection<Section> Sections { get; set; } = new List<Section>();
}
