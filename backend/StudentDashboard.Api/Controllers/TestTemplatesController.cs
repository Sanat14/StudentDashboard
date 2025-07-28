using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentDashboard.Api.Data;
using StudentDashboard.Api.Models;

namespace StudentDashboard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestTemplatesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TestTemplatesController(AppDbContext context)
        {
            _context = context;
        }

        // POST: /api/testtemplates
        [HttpPost]
        public async Task<ActionResult<TestTemplate>> Create(TestTemplate template)
        {
            _context.TestTemplates.Add(template);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = template.Id }, template);
        }

        // GET: /api/testtemplates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestTemplate>>> GetAll()
        {
            return await _context.TestTemplates.ToListAsync();
        }

        // GET: /api/testtemplates/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TestTemplate>> GetById(int id)
        {
            var template = await _context.TestTemplates.FindAsync(id);
            if (template == null)
                return NotFound();

            return Ok(template);
        }

        // PUT: /api/testtemplates/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TestTemplate updated)
        {
            var template = await _context.TestTemplates.FindAsync(id);
            if (template == null)
                return NotFound();

            template.Title = updated.Title;
            template.Subject = updated.Subject;
            template.Topic = updated.Topic;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: /api/testtemplates/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var template = await _context.TestTemplates.FindAsync(id);
            if (template == null)
                return NotFound();

            _context.TestTemplates.Remove(template);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
