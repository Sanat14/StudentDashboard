namespace StudentDashboard.Api.DTOs
{
    public class StudentWithTeacherDto
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? ContactNumber { get; set; }
        public string? Grade { get; set; }
        public string? CreatedByEmail { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
