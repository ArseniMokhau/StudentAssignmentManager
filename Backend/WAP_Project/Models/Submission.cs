namespace WAP_Project.Models
{
    public class Submission
    {
        public string SubmissionId { get; set; }
        public string FilePath { get; set; }
        public DateTime SubmittedAt { get; set; }

        // Foreign key for Student
        public string StudentId { get; set; }
        public Student Student { get; set; }

        // Foreign key for Assignment
        public string AssignmentId { get; set; }
        public Assignment Assignment { get; set; }
    }
}
