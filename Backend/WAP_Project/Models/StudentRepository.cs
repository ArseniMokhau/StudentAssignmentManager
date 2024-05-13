namespace WAP_Project.Models
{
    public class StudentRepository
    {
        public string StudentRepositoryId { get; set; }// identificator
        public Repository Repositories { get; set; }//navigation func
        public string StudentId { get; set; }
        public Student Students { get; set; }
    }
}
