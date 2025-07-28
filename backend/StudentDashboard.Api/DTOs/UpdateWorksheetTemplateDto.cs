namespace StudentDashboard.Api.DTOs
{
    public class UpdateWorksheetTemplateDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Subject { get; set; }
        public string? Topic { get; set; }
        public string? Difficulty { get; set; }
    }
}
