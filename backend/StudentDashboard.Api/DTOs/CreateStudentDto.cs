using System.ComponentModel.DataAnnotations;

namespace StudentDashboard.Api.DTOs
{
    public class CreateStudentDto
    {
        [Required]
        public string? FullName { get; set; }

        [Required]
        [Phone]
        public string? ContactNumber { get; set; }

        [Required]
        public string? Grade { get; set; }
    }
}
