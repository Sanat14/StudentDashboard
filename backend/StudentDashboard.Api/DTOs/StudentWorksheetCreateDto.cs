namespace StudentDashboard.Api.DTOs
{
    public class StudentWorksheetCreateDto
    {
        public int StudentId { get; set; }
        public int WorksheetTemplateId { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
