using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityAPI.Models;

public enum EnrollmentStatus
{
    Enrolled,
    Completed,
    Dropped,
    Canceled
}

[Table("enrollments")]
public class Enrollment
{
    [Key]
    [Column("enrollment_id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int EnrollmentId { get; set; }

    [Required]
    [Column("student_id")]
    [StringLength(20)]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    [Column("section_id")]
    public int SectionId { get; set; }

    [Column("enroll_date")]
    public DateTime EnrollDate { get; set; } = DateTime.UtcNow;

    [Column("status")]
    [StringLength(20)]
    public string Status { get; set; } = "Enrolled";

    // Navigation properties
    [ForeignKey("StudentId")]
    public virtual Student? Student { get; set; }

    [ForeignKey("SectionId")]
    public virtual Section? Section { get; set; }

    public virtual Grade? Grade { get; set; }
}
