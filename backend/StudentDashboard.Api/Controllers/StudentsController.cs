using Microsoft.AspNetCore.Mvc;
using StudentDashboard.Api.Data;
using StudentDashboard.Api.Models;
using StudentDashboard.Api.DTOs;
using System.Security.Claims;

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
    }
}
