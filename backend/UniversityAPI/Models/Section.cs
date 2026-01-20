using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityAPI.Models;

public enum SectionStatus
{
    Open,
    Closed,
    Canceled
}

[Table("sections")]
public class Section
{
    [Key]
    [Column("section_id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int SectionId { get; set; }

    [Required]
    [Column("course_id")]
    [StringLength(20)]
    public string CourseId { get; set; } = string.Empty;

    [Required]
    [Column("semester")]
    [StringLength(20)]
    public string Semester { get; set; } = string.Empty;

    [Required]
    [Column("teacher_id")]
    [StringLength(20)]
    public string TeacherId { get; set; } = string.Empty;

    [Required]
    [Column("capacity")]
    public int Capacity { get; set; }

    [Column("status")]
    [StringLength(20)]
    public string Status { get; set; } = "Open";

    [Column("is_grade_locked")]
    public bool IsGradeLocked { get; set; } = false;

    [Column("schedule")]
    [StringLength(100)]
    public string? Schedule { get; set; }

    [Column("room")]
    [StringLength(50)]
    public string? Room { get; set; }

    // Navigation properties
    [ForeignKey("CourseId")]
    public virtual Course? Course { get; set; }

    [ForeignKey("TeacherId")]
    public virtual Teacher? Teacher { get; set; }

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
