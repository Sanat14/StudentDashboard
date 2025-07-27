using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentDashboard.Api.Data;
using StudentDashboard.Api.DTOs;
using StudentDashboard.Api.Models;

namespace StudentDashboard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentTestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentTestsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/studenttests?studentId=3
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentTestDto>>> GetTests([FromQuery] int? studentId)
        {
            var query = _context.StudentTests
                .Include(st => st.Template)
                .Include(st => st.Student)
                .AsQueryable();

            if (studentId.HasValue)
            {
                query = query.Where(st => st.StudentId == studentId.Value);
            }

            var results = await query
                .Select(st => new StudentTestDto
                {
                    StudentName = st.Student!.FullName,
                    TestTitle = st.Template!.Title,
                    Subject = st.Template.Subject,
                    Topic = st.Template.Topic,
                    Score = st.Score,
                    Passed = st.Passed,
                    DateTaken = st.DateTaken ?? default
                })
                .ToListAsync();

            return results;
        }

        // POST: /api/studenttests
        [HttpPost]
        public async Task<ActionResult<StudentTest>> AssignTest([FromBody] StudentTest test)
        {
            
            Console.WriteLine(">>> POST /api/studenttests hit!");
            Console.WriteLine($"TestTemplateId: {test.TestTemplateId}, StudentId: {test.StudentId}");
            _context.StudentTests.Add(test);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTests), new { id = test.Id }, test);
        }

        // PUT: /api/studenttests/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTestResult(int id, StudentTest updated)
        {
            var existing = await _context.StudentTests
                .Include(st => st.Template)
                .FirstOrDefaultAsync(st => st.Id == id);

            if (existing == null) return NotFound();

            existing.Score = updated.Score;
            existing.Passed = updated.Passed;
            existing.DateTaken = updated.DateTaken;

            if (updated.DateTaken != null)
            {
                var progressEntry = new StudentProgress
                {
                    StudentId = existing.StudentId,
                    EventType = "Test Completed",
                    Description = $"Completed test: {existing.Template?.Title ?? "Unknown"}",
                    Timestamp = DateTime.UtcNow
                };

                _context.StudentProgress.Add(progressEntry);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
