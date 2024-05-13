namespace WAP_Project.Models
{
    public class Repository
    {
        public string RepositoryId { get; set; }
        public string RepositoryName { get; set; }

        public ICollection<TeacherRepository> TeacherRepositories { get; set; }
        public ICollection<StudentRepository> StudentRepositories { get; set; }
        public ICollection<RepositoryAssigments> RepositoriesAssigments { get; set; }

        // ученик курс, препод курс, курс задание  id название форма задания


        /* public ICollection<StudentCourse> Students { get; set; } // Связь многие-ко-многим для участников курса
         public ICollection<TaskAssignment> Tasks { get; set; } // Задания курса*/

    }
}
