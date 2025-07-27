using System;

namespace StudentDashboard.Api.Models
{
    public class StudentProgress
    {
        public int Id { get; set; }
        public string? EventType { get; set; } // e.g., "Worksheet Submitted"
        public string? Description { get; set; }
        public DateTime Timestamp { get; set; }

        // Foreign key
        public int StudentId { get; set; }

        // Navigation property
        public Student? Student { get; set; }
    }
}
