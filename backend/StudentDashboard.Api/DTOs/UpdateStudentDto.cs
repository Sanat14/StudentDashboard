using System.ComponentModel.DataAnnotations;

namespace StudentDashboard.Api.DTOs
{
    public class UpdateStudentDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        public string? ContactNumber { get; set; }

        public string? Grade { get; set; }
    }
}
