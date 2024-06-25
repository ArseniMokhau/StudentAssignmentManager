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
        public DbSet<StudentAssignments> studentAssignments { get; set; }
        public DbSet<RepositoryAssigments> RepositoryAssigments { get; set; }
        public DbSet<RepositoryAccessRequest> RepositoryAccessRequests { get; set; }



    }
}

/*Relationship between Submission and Student

Submission has one Student.
Student can have many Submissions.
In the Submission table, there is a foreign key StudentId
pointing to Student.*/