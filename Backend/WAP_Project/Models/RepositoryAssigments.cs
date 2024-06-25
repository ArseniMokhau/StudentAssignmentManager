using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WAP_Project.Models
{
    public class RepositoryAssigments
    {
        [Key] public string AssignmentId { get; set; }

        public string RepositoryId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

    /*    [ForeignKey("RepositoryId")]
        public Repository Repositories { get; set; }*/

    }
}
