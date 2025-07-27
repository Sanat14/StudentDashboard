using System;

namespace StudentDashboard.Api.Models
{
    public class StudentWorksheet
    {
        public int Id { get; set; }

        public int WorksheetTemplateId { get; set; }
        public WorksheetTemplate? Template { get; set; }

        public int StudentId { get; set; }
        public Student? Student { get; set; }

        public DateTime AssignedDate { get; set; }
        public DateTime? SubmittedDate { get; set; }
    }
}
