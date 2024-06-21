using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [ForeignKey("RepositoryAssignments")]
        public string AssignmentId { get; set; }
        public RepositoryAssigments RepositoryAssigments { get; set; }

        [ForeignKey("Student")]
        public string StudentId { get; set; }
        public Student Student { get; set; }
    }
}
