using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityAPI.Models;

[Table("grades")]
public class Grade
{
    [Key]
    [Column("grade_id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int GradeId { get; set; }

    [Required]
    [Column("enrollment_id")]
    public int EnrollmentId { get; set; }

    [Column("midterm")]
    public decimal? Midterm { get; set; }

    [Column("final")]
    public decimal? Final { get; set; }

    [Column("other")]
    public decimal? Other { get; set; }

    [Column("gpa_point")]
    public decimal? GpaPoint { get; set; }

    [Column("letter_grade")]
    [StringLength(5)]
    public string? LetterGrade { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_by")]
    [StringLength(20)]
    public string? UpdatedBy { get; set; }

    // Navigation properties
    [ForeignKey("EnrollmentId")]
    public virtual Enrollment? Enrollment { get; set; }
}
