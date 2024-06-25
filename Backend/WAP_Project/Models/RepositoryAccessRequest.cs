using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WAP_Project.Models
{
    public class RepositoryAccessRequest
    {
        [Key]
        public string RepositoryAccessRequestId { get; set; }

        [ForeignKey("Repository")]
        public string CourseId { get; set; }
        public Repository Course { get; set; }

        [ForeignKey("Students")]
        public string StudentId { get; set; }
        public Student Student { get; set; }

     /*   [ForeignKey("TeacherRepositories")]
        public string TeacherRepositoriesId { get; set; }
        public TeacherRepository TeacherRepositories { get; set; }*/
        public DateTime RequestTime { get; set; }
    }
}
