using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WAP_Project.Models
{
    public class StudentAssignments
    {
        // Primary key
        [Key]
        public string StudentAssignmentId { get; set; }

        // Title of the submitted assignment
        public string Title { get; set; }

        // Deadline for the assignment submission
        public DateTime Deadline { get; set; }
        public DateTime SubmissionDate { get; set; }

        [ForeignKey("RepositoryAssigments")]
        public string AssignmentId { get; set; }
        public RepositoryAssigments RepositoryAssigments { get; set; }

        [ForeignKey("StudentId")]
        public string StudentId { get; set; }
        public Student Student { get; set; }
    }
}
