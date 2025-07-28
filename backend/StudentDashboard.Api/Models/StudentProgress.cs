using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentDashboard.Api.Models
{
    public class StudentProgress
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Student))]
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public string EventType { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime Timestamp { get; set; }
    }
}
