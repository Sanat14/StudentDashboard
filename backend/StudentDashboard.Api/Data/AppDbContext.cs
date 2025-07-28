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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Student ↔ StudentWorksheet
            modelBuilder.Entity<StudentWorksheet>()
                .HasOne(sw => sw.Student)
                .WithMany(s => s.StudentWorksheets)
                .HasForeignKey(sw => sw.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Student ↔ StudentTest
            modelBuilder.Entity<StudentTest>()
                .HasOne(st => st.Student)
                .WithMany(s => s.StudentTests)
                .HasForeignKey(st => st.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Student ↔ StudentProgress
            modelBuilder.Entity<StudentProgress>()
                .HasOne(sp => sp.Student)
                .WithMany(s => s.Progress)
                .HasForeignKey(sp => sp.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            // WorksheetTemplate ↔ StudentWorksheet
            modelBuilder.Entity<StudentWorksheet>()
                .HasOne(sw => sw.Template)
                .WithMany(wt => wt.AssignedWorksheets)
                .HasForeignKey(sw => sw.WorksheetTemplateId)
                .OnDelete(DeleteBehavior.Cascade);

            // TestTemplate ↔ StudentTest
            modelBuilder.Entity<StudentTest>()
                .HasOne(st => st.Template)
                .WithMany(tt => tt.AssignedTests)
                .HasForeignKey(st => st.TestTemplateId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
