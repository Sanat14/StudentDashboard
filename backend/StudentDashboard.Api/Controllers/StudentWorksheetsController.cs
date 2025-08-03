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

            var data = await query.ToListAsync(); // Fetch to memory

            var results = data.Select(sw => new StudentWorksheetDto
            {
                Id = sw.Id,
                StudentName = sw.Student?.FullName ?? "Unknown",
                WorksheetTitle = sw.Template?.Title ?? "Untitled",
                Topic = sw.Template?.Topic ?? "N/A",
                Subject = sw.Template?.Subject ?? "N/A",
                AssignedDate = sw.AssignedDate,
                SubmittedDate = sw.SubmittedDate,
                Score = sw.Score,
                DueDate = sw.DueDate
            }).ToList();

            return Ok(results);
        }


        // GET: /api/studentworksheets/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentWorksheetDto>> GetById(int id)
        {
            var sw = await _context.StudentWorksheets
                .Include(sw => sw.Template)
                .Include(sw => sw.Student)
                .FirstOrDefaultAsync(sw => sw.Id == id);

            if (sw == null)
                return NotFound();

            var dto = new StudentWorksheetDto
            {
                Id = sw.Id,
                StudentName = sw.Student?.FullName ?? "Unknown",
                WorksheetTitle = sw.Template?.Title ?? "Untitled",
                Topic = sw.Template?.Topic ?? "N/A",
                Subject = sw.Template?.Subject ?? "N/A",
                AssignedDate = sw.AssignedDate,
                SubmittedDate = sw.SubmittedDate,
                Score = sw.Score,
                DueDate = sw.DueDate
            };

            return Ok(dto);
        }


        // POST: /api/studentworksheets
        [HttpPost]
        public async Task<ActionResult<StudentWorksheet>> AssignWorksheet([FromBody] StudentWorksheetCreateDto dto)
        {
            var assignment = new StudentWorksheet
            {
                StudentId = dto.StudentId,
                WorksheetTemplateId = dto.WorksheetTemplateId,
                AssignedDate = DateTime.UtcNow,
                DueDate = dto.DueDate
            };

            _context.StudentWorksheets.Add(assignment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAssignedWorksheets), new { studentId = dto.StudentId }, assignment);
        }

        // PUT: /api/studentworksheets/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubmission(int id, StudentWorksheetUpdateDto dto)
        {
            var existing = await _context.StudentWorksheets
                .Include(sw => sw.Template)
                .FirstOrDefaultAsync(sw => sw.Id == id);

            if (existing == null)
                return NotFound();

            existing.SubmittedDate = dto.SubmittedDate;
            existing.Score = dto.Score;
            // Removed due date update as per requirements

            // Changed logic: Mark as completed when score is provided, not when submitted date is set
            if (dto.Score != null && dto.Score.HasValue)
            {
                // Set submitted date to current time if not already set
                if (existing.SubmittedDate == null)
                {
                    existing.SubmittedDate = DateTime.UtcNow;
                }

                var progressEntry = new StudentProgress
                {
                    StudentId = existing.StudentId,
                    EventType = "Worksheet Completed",
                    Description = $"Completed worksheet: {existing.Template?.Title ?? "Unknown"} with score: {dto.Score}%",
                    Timestamp = DateTime.UtcNow
                };

                _context.StudentProgress.Add(progressEntry);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: /api/studentworksheets/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var assignment = await _context.StudentWorksheets.FindAsync(id);
            if (assignment == null)
                return NotFound();

            _context.StudentWorksheets.Remove(assignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
