using Microsoft.AspNetCore.Mvc;
using StudentDashboard.Api.Data;
using StudentDashboard.Api.Models;
using StudentDashboard.Api.DTOs;

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
        public ActionResult<IEnumerable<Student>> GetStudents()
        {
            return Ok(_context.Students.ToList());
        }

        // POST: /api/students
        [HttpPost]
        public ActionResult<Student> CreateStudent(CreateStudentDto studentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var student = new Student
            {
                FullName = studentDto.FullName,
                Email = studentDto.Email,
                Grade = studentDto.Grade
                // CreatedAt is auto-set
            };

            _context.Students.Add(student);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetStudents), new { id = student.Id }, student);
        }
    }
}
