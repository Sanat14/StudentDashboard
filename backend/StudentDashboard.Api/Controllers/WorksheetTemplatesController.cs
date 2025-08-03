using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentDashboard.Api.Data;
using StudentDashboard.Api.DTOs;
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

        // GET: /api/worksheettemplates/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<WorksheetTemplate>> GetById(int id)
        {
            var template = await _context.WorksheetTemplates.FindAsync(id);
            if (template == null)
                return NotFound();

            return Ok(template);
        }

        // POST: /api/worksheettemplates
        [HttpPost]
        public async Task<ActionResult<WorksheetTemplate>> Create(WorksheetTemplate template)
        {
            _context.WorksheetTemplates.Add(template);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = template.Id }, template);
        }

        // PUT: /api/worksheettemplates/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateWorksheetTemplateDto dto)
        {
            var template = await _context.WorksheetTemplates.FindAsync(id);
            if (template == null)
                return NotFound();

            // Only update fields that were provided (not null)
            if (dto.Title != null)
                template.Title = dto.Title;
            
            if (dto.Subject != null)
                template.Subject = dto.Subject;
            
            if (dto.Topic != null)
                template.Topic = dto.Topic;
            
            if (dto.Difficulty != null)
                template.Difficulty = dto.Difficulty;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: /api/worksheettemplates/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var template = await _context.WorksheetTemplates.FindAsync(id);
            if (template == null)
                return NotFound();

            _context.WorksheetTemplates.Remove(template);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
