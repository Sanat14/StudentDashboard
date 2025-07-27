using Microsoft.EntityFrameworkCore;
using StudentDashboard.Api.Models;

namespace StudentDashboard.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // This creates a Students table in the database
        public DbSet<Student> Students { get; set; }
        public DbSet<WorksheetTemplate> WorksheetTemplates { get; set; }
        public DbSet<TestTemplate> TestTemplates { get; set; }

        public DbSet<StudentWorksheet> StudentWorksheets { get; set; }
        public DbSet<StudentTest> StudentTests { get; set; }
        public DbSet<StudentProgress> StudentProgress { get; set; }
    }
}
