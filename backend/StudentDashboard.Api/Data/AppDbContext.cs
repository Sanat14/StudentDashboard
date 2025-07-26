using Microsoft.EntityFrameworkCore;
using StudentDashboard.Api.Models;

namespace StudentDashboard.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        // This creates a Students table in the database
        public DbSet<Student> Students { get; set; }
    }
}
