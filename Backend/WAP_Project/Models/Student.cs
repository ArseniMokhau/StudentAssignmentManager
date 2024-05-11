namespace WAP_Project.Models
{
    public class Student
    {
        public string StudentId { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        
        // Опционально: может быть обновлено после регистрации/входа
        //public string? Token { get; set; } // Разрешить NULL значения для поля Token
    }
}
