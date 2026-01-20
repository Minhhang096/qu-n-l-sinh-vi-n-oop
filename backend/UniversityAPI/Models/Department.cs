using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityAPI.Models;

[Table("departments")]
public class Department
{
    [Key]
    [Column("dept_id")]
    [StringLength(10)]
    public string DeptId { get; set; } = string.Empty;

    [Required]
    [Column("dept_name")]
    [StringLength(100)]
    public string DeptName { get; set; } = string.Empty;

    // Navigation properties
    public virtual ICollection<Class> Classes { get; set; } = new List<Class>();
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
    public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();
}
