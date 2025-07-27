using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentDashboard.Api.Data;
using StudentDashboard.Api.DTOs;
using StudentDashboard.Api.Models;

namespace StudentDashboard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentWorksheetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentWorksheetsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/studentworksheets?studentId=3
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentWorksheetDto>>> GetAssignedWorksheets([FromQuery] int? studentId)
        {
            var query = _context.StudentWorksheets
                .Include(sw => sw.Template)
                .Include(sw => sw.Student)
                .AsQueryable();

            if (studentId.HasValue)
            {
                query = query.Where(sw => sw.StudentId == studentId.Value);
            }

            var results = await query
                .Select(sw => new StudentWorksheetDto
                {
                    StudentName = sw.Student!.FullName,
                    WorksheetTitle = sw.Template!.Title,
                    Topic = sw.Template.Topic,
                    Subject = sw.Template.Subject,
                    AssignedDate = sw.AssignedDate,
                    SubmittedDate = sw.SubmittedDate
                })
                .ToListAsync();

            return Ok(results);
        }

        // POST: /api/studentworksheets
        [HttpPost]
        public async Task<ActionResult<StudentWorksheet>> AssignWorksheet(StudentWorksheet assignment)
        {
            _context.StudentWorksheets.Add(assignment);
            assignment.AssignedDate = DateTime.SpecifyKind(assignment.AssignedDate, DateTimeKind.Utc);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAssignedWorksheets), new { id = assignment.Id }, assignment);
        }

        // PUT: /api/studentworksheets/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubmission(int id, StudentWorksheet updated)
        {
            var existing = await _context.StudentWorksheets.FindAsync(id);
            if (existing == null) return NotFound();

            existing.SubmittedDate = updated.SubmittedDate;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
