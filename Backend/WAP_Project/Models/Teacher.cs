namespace WAP_Project.Models
{
    public class Teacher
    {
        public string TeacherId { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public ICollection<TeacherRepository> TeacherRepositories { get; set; }

        // public string Token { get; set; } // Опционально: может быть обновлено после регистрации/входа
    }
}
