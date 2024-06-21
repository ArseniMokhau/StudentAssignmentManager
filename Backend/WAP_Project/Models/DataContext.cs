using Microsoft.EntityFrameworkCore;

namespace WAP_Project.Models
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { 
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserToken> UserTokens { get; set; }
        public DbSet<Repository> Repositories { get; set; }
        public DbSet<StudentRepository> StudentRepositories { get; set; }
        public DbSet<TeacherRepository> TeacherRepositories { get; set; }
        public DbSet<StudentAssigments> studentAssigments { get; set; }
        public DbSet<RepositoryAssigments> RepositoryAssigments { get; set; }

        // ученик курс, препод курс, курс задание  id название форма задания
    }
}
