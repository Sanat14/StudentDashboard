using System.ComponentModel.DataAnnotations;

namespace StudentDashboard.Api.DTOs
{
    public class UpdateStudentDto
    {
        public string? FullName { get; set; }

        public string? ContactNumber { get; set; }

        public string? Grade { get; set; }
    }
}
