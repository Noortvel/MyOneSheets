using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyOneSheets.Models
{
    public class SheetModel
    {
        public int Id { get; set; }
        public string AuthorId { get; set; }
        public string Header { get; set; }
        public string Body { get; set; }
    }
}
