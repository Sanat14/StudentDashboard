namespace StudentDashboard.Api.Models
{
    public class TestTemplate
    {
        public int Id { get; set; }
        public string? Title { get; set; } 
        public string? Subject { get; set; }
        public string? Topic { get; set; }

        public List<StudentTest> AssignedTests { get; set; } = new();
    }
}
