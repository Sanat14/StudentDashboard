using System;

namespace StudentDashboard.Api.DTOs
{
    public class StudentProgressDto
    {
        public string? EventType { get; set; }
        public string? Description { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
