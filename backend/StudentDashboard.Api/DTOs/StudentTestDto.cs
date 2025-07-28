namespace StudentDashboard.Api.DTOs
{
    public class StudentTestDto
    {
        public int Id { get; set; }
        public string? StudentName { get; set; }
        public string? TestTitle { get; set; }
        public string? Subject { get; set; }
        public string? Topic { get; set; }
        public double? Score { get; set; }
        public bool? Passed { get; set; }
        public DateTime? DateTaken { get; set; }
    }
}
