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
                    Id = st.Id,
                    StudentName = st.Student!.FullName,
                    TestTitle = st.Template!.Title,
                    Subject = st.Template.Subject,
                    Topic = st.Template.Topic,
                    Score = st.Score,
                    Passed = st.Passed,
                    DateTaken = st.DateTaken
                })
                .ToListAsync();

            return results;
        }

        // GET: /api/studenttests/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentTest>> GetById(int id)
        {
            var test = await _context.StudentTests
                .Include(t => t.Student)
                .Include(t => t.Template)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (test == null)
                return NotFound();

            return Ok(test);
        }

        // POST: /api/studenttests
        [HttpPost]
        public async Task<ActionResult<StudentTest>> AssignTest([FromBody] StudentTestCreateDto dto)
        {
            var test = new StudentTest
            {
                StudentId = dto.StudentId,
                TestTemplateId = dto.TestTemplateId,
                AssignedDate = dto.AssignedDate
            };

            _context.StudentTests.Add(test);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTests), new { id = test.Id }, test);
        }

        // PUT: /api/studenttests/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTestResult(int id, StudentTestUpdateDto updated)
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

        // DELETE: /api/studenttests/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var test = await _context.StudentTests.FindAsync(id);
            if (test == null)
                return NotFound();

            _context.StudentTests.Remove(test);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
