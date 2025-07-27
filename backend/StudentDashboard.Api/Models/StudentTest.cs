using System;

namespace StudentDashboard.Api.Models
{
    public class StudentTest
    {
        public int Id { get; set; }

        public int TestTemplateId { get; set; }
        public TestTemplate? Template { get; set; }

        public int StudentId { get; set; }
        public Student? Student { get; set; }

        public double? Score { get; set; }
        public bool? Passed { get; set; }
        public DateTime? DateTaken { get; set; }
    }
}
