namespace StudentDashboard.Api.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? ContactNumber { get; set;}
        public string? Grade { get; set; }
        public string? CreatedBy { get; set; } 
        public string? CreatedByEmail { get; set; } 
        public List<StudentWorksheet> StudentWorksheets { get; set; } = new();
        public List<StudentTest> StudentTests { get; set; } = new();
        public List<StudentProgress> Progress { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  
    }
}
