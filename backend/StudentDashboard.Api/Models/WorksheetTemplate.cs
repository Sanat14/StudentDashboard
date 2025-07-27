using System.Collections.Generic;

namespace StudentDashboard.Api.Models
{
    public class WorksheetTemplate
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Subject { get; set; }
        public string? Topic { get; set; }
        public string? Difficulty { get; set; }

        public List<StudentWorksheet> AssignedWorksheets { get; set; } = new();
    }
}
