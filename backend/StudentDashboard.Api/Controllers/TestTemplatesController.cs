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

        // GET: /api/testtemplates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestTemplate>>> GetAll()
        {
            return await _context.TestTemplates.ToListAsync();
        }

        // POST: /api/testtemplates
        [HttpPost]
        public async Task<ActionResult<TestTemplate>> Create(TestTemplate template)
        {
            _context.TestTemplates.Add(template);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = template.Id }, template);
        }
    }
}
