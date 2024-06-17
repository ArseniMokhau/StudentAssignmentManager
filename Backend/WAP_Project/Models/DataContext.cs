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
        public DbSet<Assignment> Assignments { get; set; }
        public  DbSet<Submission> Submissions { get; set; }
        public DbSet<Repository> Repositories { get; set; }
        public DbSet<TeacherRepository> TeacherRepositories { get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Student)
                .WithMany(st => st.Submissions)
                .HasForeignKey(s => s.StudentId);

            modelBuilder.Entity<Submission>()
                .HasOne(s => s.Assignment)
                .WithMany(a => a.Submissions)
                .HasForeignKey(s => s.AssignmentId);

            modelBuilder.Entity<Assignment>()
                .HasOne(a => a.Repository)
                .WithMany(r => r.Assignments)
                .HasForeignKey(a => a.RepositoryId);

            modelBuilder.Entity<TeacherRepository>()
                .HasKey(tr => new { tr.TeacherId, tr.RepositoryId });

            modelBuilder.Entity<TeacherRepository>()
                .HasOne(tr => tr.Teacher)
                .WithMany(t => t.TeacherRepositories)
                .HasForeignKey(tr => tr.TeacherId);

            modelBuilder.Entity<TeacherRepository>()
                .HasOne(tr => tr.Repository)
                .WithMany(r => r.TeacherRepositories)
                .HasForeignKey(tr => tr.RepositoryId);
        }
    }
}

/*Relationship between Submission and Student

Submission has one Student.
Student can have many Submissions.
In the Submission table, there is a foreign key StudentId
pointing to Student.*/