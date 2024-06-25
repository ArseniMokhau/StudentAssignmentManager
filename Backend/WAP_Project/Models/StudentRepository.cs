using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WAP_Project.Models
{
    public class StudentRepository
    {
        [Key]
        public string StudentRepositoryId { get; set; }

        [ForeignKey("RepositoryAssignments")]
        public string RepositoriesRepositoryId { get; set; }
        public Repository Repository { get; set; }

        [ForeignKey("Student")]
        public string StudentId { get; set; }
        public Student Student { get; set; }


    }
}
