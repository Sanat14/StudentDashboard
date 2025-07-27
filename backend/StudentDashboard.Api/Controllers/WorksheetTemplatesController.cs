using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentDashboard.Api.Data;
using StudentDashboard.Api.Models;

namespace StudentDashboard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorksheetTemplatesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorksheetTemplatesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/worksheettemplates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorksheetTemplate>>> GetAll()
        {
            return await _context.WorksheetTemplates.ToListAsync();
        }

        // POST: /api/worksheettemplates
        [HttpPost]
        public async Task<ActionResult<WorksheetTemplate>> Create(WorksheetTemplate template)
        {
            _context.WorksheetTemplates.Add(template);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = template.Id }, template);
        }
    }
}
