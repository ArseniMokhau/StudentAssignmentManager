using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WAP_Project.Models
{
    public class TeacherRepository
    {
        [Key]
        public string TeacherRepositoryId { get; set; }

        [ForeignKey("Repositories")]
        public string RepositoriesRepositoryId { get; set; }
        public Repository Repositories { get; set; }

        [ForeignKey("Teachers")]
        public string TeacherId { get; set; }
        public Teacher Teachers { get; set; }

    }
}
