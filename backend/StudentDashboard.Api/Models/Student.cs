namespace StudentDashboard.Api.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Grade { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // When student was added
    }
}
