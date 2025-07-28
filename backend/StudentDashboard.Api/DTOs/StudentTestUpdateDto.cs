namespace StudentDashboard.Api.DTOs
{
    public class StudentTestUpdateDto
    {
        public double? Score { get; set; }
        public bool? Passed { get; set; }
        public DateTime? DateTaken { get; set; }
    }
}
