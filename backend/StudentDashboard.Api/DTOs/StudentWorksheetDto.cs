namespace StudentDashboard.Api.DTOs
{
    public class StudentWorksheetDto
    {
        public string? StudentName { get; set; }
        public string? WorksheetTitle { get; set; }
        public string? Topic { get; set; }
        public string? Subject { get; set; }
        public DateTime AssignedDate { get; set; }
        public DateTime? SubmittedDate { get; set; }
    }
}
