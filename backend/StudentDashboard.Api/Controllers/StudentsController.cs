using Microsoft.AspNetCore.Mvc;
using StudentDashboard.Api.Data;
using StudentDashboard.Api.Models;
using StudentDashboard.Api.DTOs;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace StudentDashboard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // This becomes: /api/students
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/students
        [HttpGet]
        public ActionResult<IEnumerable<StudentWithTeacherDto>> GetStudents()
        {
            var students = _context.Students
                .Select(s => new StudentWithTeacherDto
                {
                    Id = s.Id,
                    FullName = s.FullName,
                    ContactNumber = s.ContactNumber,
                    Grade = s.Grade,
                    CreatedByEmail = s.CreatedByEmail,
                    CreatedAt = s.CreatedAt
                })
                .OrderBy(s => s.CreatedByEmail)
                .ToList();

            return Ok(students);
        }

        // GET: /api/students/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentWithTeacherDto>> GetStudentById(int id)
        {
            var student = await _context.Students
                .Where(s => s.Id == id)
                .Select(s => new StudentWithTeacherDto
                {
                    Id = s.Id,
                    FullName = s.FullName,
                    ContactNumber = s.ContactNumber,
                    Grade = s.Grade,
                    CreatedByEmail = s.CreatedByEmail,
                    CreatedAt = s.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (student == null)
                return NotFound();

            return Ok(student);
        }

        // GET: /api/students/{id}/summary
        [HttpGet("{id}/summary")]
        public async Task<ActionResult<StudentSummaryDto?>> GetStudentSummary(int id)
        {
            var studentExists = await _context.Students.AnyAsync(s => s.Id == id);
            if (!studentExists)
                return NotFound($"No student found with ID {id}.");

            var studentName = await _context.Students
                .Where(s => s.Id == id)
                .Select(s => s.FullName)
                .FirstOrDefaultAsync();

            if (studentName == null)
                return NotFound($"No student found with ID {id}.");

            var totalWorksheetsAssigned = await _context.StudentWorksheets
                .CountAsync(w => w.StudentId == id);

            var totalWorksheetsSubmitted = await _context.StudentWorksheets
                .CountAsync(w => w.StudentId == id && w.SubmittedDate != null);

            var tests = await _context.StudentTests
                .Where(t => t.StudentId == id && t.DateTaken != null)
                .ToListAsync();

            var totalTestsTaken = tests.Count;
            var averageTestScore = tests.Any() ? tests.Average(t => t.Score) : 0.0;

            var mostRecentActivity = await _context.StudentProgress
                .Where(p => p.StudentId == id)
                .OrderByDescending(p => p.Timestamp)
                .FirstOrDefaultAsync();

            var summary = new StudentSummaryDto
            {
                StudentName = studentName,
                TotalWorksheetsAssigned = totalWorksheetsAssigned,
                TotalWorksheetsSubmitted = totalWorksheetsSubmitted,
                TotalTestsTaken = totalTestsTaken,
                AverageTestScore = Math.Round(averageTestScore ?? 0.0, 2),
                MostRecentActivityDescription = mostRecentActivity?.Description,
                MostRecentActivityTimestamp = mostRecentActivity?.Timestamp
            };

            Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(summary));
            return Ok(summary);
        }

        // POST: /api/students
        [HttpPost]
        public ActionResult<Student> CreateStudent(CreateStudentDto studentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var uid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(uid))
            {
                return Unauthorized("Missing Firebase UID.");
            }

            var student = new Student
            {
                FullName = studentDto.FullName,
                ContactNumber = studentDto.ContactNumber,
                Grade = studentDto.Grade,
                CreatedBy = uid,
                CreatedByEmail = email,
            };

            _context.Students.Add(student);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetStudents), new { id = student.Id }, student);
        }

        // PUT: /api/students/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, UpdateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound($"No student found with ID {id}.");

            student.FullName = dto.FullName;
            student.ContactNumber = dto.ContactNumber;
            student.Grade = dto.Grade;

            _context.Students.Update(student);
            await _context.SaveChangesAsync();

            return NoContent(); // 204
        }
        
        // DELETE: /api/students/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound($"No student found with ID {id}.");

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent(); // 204
        }
    }
}
