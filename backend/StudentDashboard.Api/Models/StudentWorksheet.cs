using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentDashboard.Api.Models
{
    public class StudentWorksheet
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Student))]
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        [ForeignKey(nameof(Template))]
        public int WorksheetTemplateId { get; set; }
        public WorksheetTemplate Template { get; set; } = null!;
        public DateTime AssignedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public double? Score { get; set; }
    }
}
