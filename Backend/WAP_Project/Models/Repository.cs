namespace WAP_Project.Models
{
    public class Repository
    {
        public string RepositoryId { get; set; }
        public string Name { get; set; }
        public ICollection<TeacherRepository> TeacherRepositories { get; set; }
        public ICollection<Assignment> Assignments { get; set; }

    }
}
