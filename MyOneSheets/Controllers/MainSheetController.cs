using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyOneSheets.Data;
using System.Collections.Generic;
using System.Linq;

namespace MyOneSheets.Controllers
{
    [Authorize]
    public class MainSheetController : Controller
    {
        private readonly ApplicationDbContext _context;
        public MainSheetController(ApplicationDbContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IEnumerable<Models.SheetModel> Get()
        {
            var authorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value;
            var q = _context.Sheets.Where(o => o.AuthorId == authorId).OrderBy(o => o.Id);
            return q;
        }
        [HttpPost]
        public IActionResult Update([FromBody] Models.SheetModel model)
        {
            var authorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value;
            var oldModel = _context.Sheets.Where(o => o.AuthorId == authorId).FirstOrDefault(o => o.Id == model.Id);
            if (oldModel != null)
            {
                model.AuthorId = authorId;
                _context.Entry(oldModel).CurrentValues.SetValues(model);
                _context.SaveChanges();
                return Ok("");
            }
            return BadRequest($"Model '{model.Id}' on Author '{User.Identity.Name}' doesnt exist");
        }
        [HttpPost]
        public IActionResult Create([FromBody] Models.SheetModel model)
        {
            var authorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value;
            model.Id = 0;
            model.AuthorId = authorId;
            _context.Sheets.Add(model);
            _context.SaveChanges();
            return new JsonResult(model.Id);
        }
        [HttpPost]
        public IActionResult Delete([FromBody] int id)
        {
            var authorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value;
            var model = _context.Sheets.Where(o => o.AuthorId == authorId).FirstOrDefault(o => o.Id == id);
            if (model != null)
            {
                _context.Sheets.Remove(model);
                _context.SaveChanges();
                return Ok("");
            }
            return BadRequest($"{id} model doesnt exist");
        }
    }
}
