namespace WAP_Project.Models
{
    public class TeacherRepository
    {
        public string TeacherRepositoryId { get; set; }
        public Repository Repositories { get; set; }
        public string TeacherId { get; set; }
        public Teacher Teachers { get; set; }
    }
}
