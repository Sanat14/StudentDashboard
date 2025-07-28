using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentDashboard.Api.Models
{
    public class StudentTest
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Student))]
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        [ForeignKey(nameof(Template))]
        public int TestTemplateId { get; set; }
        public TestTemplate Template { get; set; } = null!;

        public DateTime AssignedDate { get; set; }
        public DateTime? DateTaken { get; set; }
        public double? Score { get; set; }
        public bool? Passed { get; set; }
    }

}
