using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentDashboard.Api.Data;
using StudentDashboard.Api.DTOs;
using StudentDashboard.Api.Models;

namespace StudentDashboard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentProgressController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentProgressController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/studentprogress?studentId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentProgressDto>>> GetProgress([FromQuery] int studentId)
        {
            var progress = await _context.StudentProgress
                .Where(p => p.StudentId == studentId)
                .OrderByDescending(p => p.Timestamp)
                .Select(p => new StudentProgressDto
                {
                    EventType = p.EventType,
                    Description = p.Description,
                    Timestamp = p.Timestamp
                })
                .ToListAsync();

            return Ok(progress);
        }

        // POST: /api/studentprogress
        [HttpPost]
        public async Task<ActionResult<StudentProgress>> LogProgress(StudentProgress progress)
        {
            progress.Timestamp = DateTime.UtcNow;

            _context.StudentProgress.Add(progress);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProgress), new { studentId = progress.StudentId }, progress);
        }
    }
}
