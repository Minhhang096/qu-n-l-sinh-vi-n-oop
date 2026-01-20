using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityAPI.Models;

[Table("classes")]
public class Class
{
    [Key]
    [Column("class_id")]
    [StringLength(20)]
    public string ClassId { get; set; } = string.Empty;

    [Required]
    [Column("class_name")]
    [StringLength(100)]
    public string ClassName { get; set; } = string.Empty;

    [Required]
    [Column("dept_id")]
    [StringLength(10)]
    public string DeptId { get; set; } = string.Empty;

    [Required]
    [Column("cohort_year")]
    public int CohortYear { get; set; }

    // Navigation properties
    [ForeignKey("DeptId")]
    public virtual Department? Department { get; set; }
    
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
