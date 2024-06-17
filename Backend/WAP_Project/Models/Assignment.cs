namespace WAP_Project.Models
{
    public class Assignment
    {
        public string AssignmentId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Deadline { get; set; }
        public string RepositoryId { get; set; }
        public Repository Repository { get; set; }
        public ICollection<Submission> Submissions { get; set; }
    }
}
