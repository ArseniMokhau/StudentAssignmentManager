using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using WAP_Project.Models;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Hosting;
using System.Data;

namespace WAP_Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _environment;

        public AuthController(ILogger<AuthController> logger, DataContext context, IWebHostEnvironment environment)
        {
            _logger = logger;
            _context = context;
            _environment = environment;
        }

        // Mock database for storing users
        private static readonly List<User> _users = new List<User>();
        private static readonly List<Student> _usersStudent = new List<Student>();
        private static readonly List<Teacher> _usersTeacher = new List<Teacher>();
        private static readonly List<UserToken> _usersTokens = new List<UserToken>();
        private static readonly List<Repository> _usersRepository = new List<Repository>();

        // Register endpoint
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterModel model)
        {

            //if we need it
            if (!IfValidateUsername(model.Username)) return BadRequest("Invalid username format");

            // Check if username already exists
            if (_context.Students.Any(u => u.Username == model.Username && u.Role == model.Role) ||
                _context.Teachers.Any(u => u.Username == model.Username && u.Role == model.Role))
            {
                return BadRequest("Username already exists");
            }
            // проверка для студ и преп отдельная бо если в студ есть такое имя то а преп уже не добавить
            if (model.Role == "Student" || model.Role == "student")
            {
                var newStudent = new Student
                {
                    StudentId = Guid.NewGuid().ToString(),
                    Username = model.Username,
                    PasswordHash = model.Password,
                    Role = model.Role
                    //Token = "" // значение по умолчанию 

                };

                _context.Students.Add(newStudent);
            }
            else if (model.Role == "Teacher" || model.Role == "teacher")
            {
                var newTeacher = new Teacher
                {
                    TeacherId = Guid.NewGuid().ToString(),
                    Username = model.Username,
                    PasswordHash = model.Password,
                    Role = model.Role
                    //Token = "" // значение по умолчанию
                };

                _context.Teachers.Add(newTeacher);
            }
            else
            {
                return BadRequest("Invalid role");
            }

            _context.SaveChanges();

            return Ok("User registered successfully");
        }

        private bool IfValidateUsername(string username)
        {
            // только буквы, и длина имени должна быть от 3 до 20 символов.
            string pattern = @"^[a-zA-Z]{3,20}$";
            return Regex.IsMatch(username, pattern);
        }

        // Login endpoint
        [HttpPost("login")]
        //проверка базы 
        public IActionResult Login([FromBody] UserLoginModel model)
        {

            Console.WriteLine($"Username: {model.Username}, PasswordHash: {model.PasswordHash}");
            Console.WriteLine($"Searching for student: Username = {model.Username}, PasswordHash = {model.PasswordHash}");
            //если Username одинаковые в ученике и учителе?
            var student = _context.Students
                .FirstOrDefault(u => u.Username == model.Username && u.PasswordHash == model.PasswordHash);
            if (student != null) return GenerateAndReturnToken(student.StudentId, student.Role);

            Console.WriteLine($"Searching for teacher: Username = {model.Username}, PasswordHash = {model.PasswordHash}");

            var teacher = _context.Teachers
                .FirstOrDefault(u => u.Username == model.Username && u.PasswordHash == model.PasswordHash);
            if (teacher != null) return GenerateAndReturnToken(teacher.TeacherId, teacher.Role);

            //_context.SaveChanges();
            return BadRequest("Invalid username or password");


            //// Create JWT token
            //var token = GenerateJwtToken(user);
            //return Ok(new { Token = token });
        }

        // Endpoint for uploading files
        [HttpPost("upload")]
        public IActionResult UploadFiles(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files uploaded");
            }

            // Define the uploads directory relative to the web root
            var uploadsDirectory = Path.Combine(_environment.WebRootPath, "Uploads");

            // Create the directory if it doesn't exist
            if (!Directory.Exists(uploadsDirectory))
            {
                Directory.CreateDirectory(uploadsDirectory);
            }

            var uploadedFileInfos = new List<string>();

            // Iterate through each file and save it to the server
            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    // Generate a unique filename
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadsDirectory, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    uploadedFileInfos.Add(filePath);
                }
            }

            return Ok(new { UploadedFiles = uploadedFileInfos });
        }

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
           // Endpoint for students to upload files for assignments
          [HttpPost("upload-assignment-file")]
         public IActionResult UploadAssignmentFile([FromQuery] string assignmentId,  List<IFormFile> files, [FromQuery] string studentId)
          {
            var assignment = _context.RepositoryAssigments.FirstOrDefault(a => a.AssignmentId == assignmentId);
              if (assignment == null) return BadRequest("Assignment not found");

            var repository = _context.Repositories.FirstOrDefault(r => r.RepositoryId == assignment.RepositoryId);
            if (repository == null) return BadRequest("repository not found");
            //if student exist at this repo

            // Check if the student  exists
            var student = _context.Students.FirstOrDefault(s => s.StudentId == studentId);
            if (student == null) return BadRequest("Student not found");

            // Check if token exists for the student
            var userToken = _context.UserTokens.FirstOrDefault(t => t.UserId == studentId);
            if (userToken == null)return Unauthorized("Token not found for the student");

       /*    // Check if the student is associated with the repository
            var studentRepository = _context.StudentRepositories.FirstOrDefault(st => st.StudentId == studentId && st.RepositoriesRepositoryId == assignment.Repositories.RepositoryId);
            if (studentRepository == null) return BadRequest("Student is not part of the repository");*/

            // Create a student assignment record
            var StudentAssignment = new StudentAssignments
            {
                StudentAssignmentId = Guid.NewGuid().ToString(),
                Title = assignment.Title,
                // Deadline = assignment.Deadline, // Assuming deadline is relevant to student's submission
                Deadline = DateTime.UtcNow,
                SubmissionDate = DateTime.UtcNow, // Store the submission date
                AssignmentId = assignmentId,
                RepositoryAssigments = assignment,
                StudentId = studentId,
                Student = student
            };

            _context.studentAssignments.Add(StudentAssignment);
            _context.SaveChanges();

           // return Ok("Course created successfully");
            var uploadsDirectory = Path.Combine(_environment.WebRootPath, "Assignments", assignmentId, studentId);

            if (!Directory.Exists(uploadsDirectory))
            {
                Directory.CreateDirectory(uploadsDirectory);
            }

            var uploadedFileInfos = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadsDirectory, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    uploadedFileInfos.Add(filePath);
                }
            }

            return Ok(new { UploadedFiles = uploadedFileInfos, assignmentId, studentId, StudentAssignment.SubmissionDate });
        }

        // Endpoint for downloading files
        [HttpGet("download/{fileName}")]

        public IActionResult DownloadFile(string fileName)
        {
            var uploadsDirectory = Path.Combine(_environment.WebRootPath, "Uploads");
            var filePath = Path.Combine(uploadsDirectory, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                stream.CopyTo(memory);
            }
            memory.Position = 0;

            return File(memory, "application/octet-stream", Path.GetFileName(filePath));
        }

        private IActionResult GenerateAndReturnToken(string username, string role)
        {
            // Check if token already exists for this user
            var existingToken = _context.UserTokens.FirstOrDefault(t => t.UserId == username);
            if (existingToken != null)
            {
                // Token already exists, return it
                return Ok(new { Token = existingToken.Token, Role = role, UserId = username });
            }

            // Create JWT token
            var token = GenerateJwtToken(username, role);
            AddTokenToDatabase(username, token);
            return Ok(new { Token = token, Role = role, UserId = username });
        }

        private void AddTokenToDatabase(string userId, string token)
        {
            var newToken = new UserToken
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Token = token
            };
            _context.UserTokens.Add(newToken);
            _context.SaveChanges();
        }
        // Helper method to generate JWT token
        private string GenerateJwtToken(string username, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("your-secret-key-with-at-least-128-bits"); // Ensure your key has at least 128 bits

            // We may also consider using stronger key generation methods
            // var key = new byte[32]; // 256 bits
            // using (var generator = RandomNumberGenerator.Create())
            // {
            //     generator.GetBytes(key);
            // }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        }),
                Expires = DateTime.UtcNow.AddDays(7), // Token expires in 7 days
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // Create course endpoint for teachers
        [HttpPost("create-repository")]
        public IActionResult CreateCourse([FromBody] Repository repository, [FromQuery] string teacherId)
        {
            // Validate model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if teacher exists
            var teacher = _context.Teachers.FirstOrDefault(t => t.TeacherId == teacherId);
            if (teacher == null)
            {
                Console.WriteLine($"Teacher not found");
                return BadRequest("Teacher not found");
            }

            // Create new course
            var newCourse = new Repository
            {
                RepositoryId = Guid.NewGuid().ToString(),
                RepositoryName = repository.RepositoryName
               /*TeacherRepositories = new List<TeacherRepository>(),
                StudentRepositories = new List<StudentRepository>(),
                RepositoriesAssigments = new List<RepositoryAssigments>()*/
            };

            _context.Repositories.Add(newCourse);
            _context.SaveChanges(); // Save changes to generate RepositoryId

            // Create entry in TeacherRepository
            var teacherRepository = new TeacherRepository
            {
                TeacherRepositoryId = Guid.NewGuid().ToString(),
                RepositoriesRepositoryId = newCourse.RepositoryId,// Course id
                TeacherId = teacher.TeacherId,
                Repositories = newCourse,
                Teachers = teacher
            };

            _context.TeacherRepositories.Add(teacherRepository);
            _context.SaveChanges();

            return Ok("Course created successfully");
        }

        [HttpGet("all-repository")]
        public ActionResult<IEnumerable<Repository>> GetRepositories()
        {
            var repositories = _context.Repositories.ToList();
            return Ok(repositories);
        }

        [HttpDelete("delete-repository")]
        public IActionResult DeleteCourse([FromQuery] string repositoryId)
        {
            // Check if repository exists
            var repository = _context.Repositories.FirstOrDefault(r => r.RepositoryId == repositoryId);

            if (repository == null)
            {
                return NotFound("Repository not found");
            }

            // Remove all related assignments
            var assignments = _context.RepositoryAssigments.Where(a => a.RepositoryId == repositoryId).ToList();
            _context.RepositoryAssigments.RemoveRange(assignments);

            // Remove all teacher associations
            var teacherRepositories = _context.TeacherRepositories.Where(tr => tr.RepositoriesRepositoryId == repositoryId).ToList();
            _context.TeacherRepositories.RemoveRange(teacherRepositories);

            // Remove all student associations
            var studentRepositories = _context.StudentRepositories.Where(sr => sr.RepositoriesRepositoryId == repositoryId).ToList();
            _context.StudentRepositories.RemoveRange(studentRepositories);

            // Remove the repository
            _context.Repositories.Remove(repository);

            // Save all changes
            _context.SaveChanges();

            return Ok("Repository deleted successfully");
        }

        // POST api/assignment/create
        [HttpPost("create-assignment")]
          public IActionResult CreateAssignment([FromBody] RepositoryAssigments assignmentRepo, [FromQuery] string teacherId)
          {
              //if (!ModelState.IsValid) return BadRequest(ModelState);

              // Check if repository (course) exists
              var repository = _context.Repositories.FirstOrDefault(r => r.RepositoryId == assignmentRepo.RepositoryId);
              if (repository == null) return BadRequest("Repository not found");

              // Check if teacher exists (assuming you have a way to authenticate the teacher)
              var teacher = _context.Teachers.FirstOrDefault(t => t.TeacherId == teacherId);
              if (teacher == null)
              {
                  return BadRequest("Teacher not found");
              }

              // Check if the teacher is associated with the repository
              var teacherRepository = _context.TeacherRepositories.FirstOrDefault(tr => tr.TeacherId == teacherId && tr.RepositoriesRepositoryId == assignmentRepo.RepositoryId);
              if (teacherRepository == null)
              {
                  return BadRequest("Teacher is not associated with this repository");
              }

              // Create new assignment
              var assignment = new RepositoryAssigments
              {
                  AssignmentId = Guid.NewGuid().ToString(),
                  RepositoryId = assignmentRepo.RepositoryId,
                  Title = assignmentRepo.Title,
                  Description = assignmentRepo.Description
              };

              _context.RepositoryAssigments.Add(assignment);
              _context.SaveChanges();

              return Ok("Assignment created successfully");
          }

        [HttpGet("all-assignments")]
        public ActionResult<IEnumerable<Repository>> GetAssignments()//ZADANIA OD KAZDOGO REPOSITORIA DURA BLYA
        {
            var assignments = _context.RepositoryAssigments.ToList();
            return Ok(assignments);
        }

        [HttpPut("update-assignment")]
        public IActionResult UpdateAssignment([FromBody] RepositoryAssigments updatedAssignment, [FromQuery] string teacherId)
        {
            // Validate the model
            if (!ModelState.IsValid)return BadRequest(ModelState);

            // Check if the assignment exists
            var assignment = _context.RepositoryAssigments.FirstOrDefault(a => a.AssignmentId == updatedAssignment.AssignmentId);
            if (assignment == null)return NotFound("Assignment not found");

            // Check if the teacher exists
            var teacher = _context.Teachers.FirstOrDefault(t => t.TeacherId == teacherId);
            if (teacher == null)return BadRequest("Teacher not found");

            // Check if the teacher is associated with the repository of the assignment
            var teacherRepository = _context.TeacherRepositories.FirstOrDefault(tr => tr.TeacherId == teacherId && tr.RepositoriesRepositoryId == assignment.RepositoryId);
            if (teacherRepository == null)return BadRequest("Teacher is not associated with this repository");

            // Update assignment details
            assignment.Title = updatedAssignment.Title;
            assignment.Description = updatedAssignment.Description;

            _context.SaveChanges();

            return Ok("Assignment updated successfully");
        }

        [HttpDelete("delete-assignment")]
          public IActionResult DeleteAssignment([FromQuery] string assignmentId)
          {
              var assignment = _context.RepositoryAssigments.FirstOrDefault(a => a.AssignmentId == assignmentId);

              if (assignment == null) return NotFound("Assignment not found");

              _context.RepositoryAssigments.Remove(assignment);
              _context.SaveChanges();

              return Ok("Assignment deleted successfully");
          }

          // Endpoint for students to request access to a course
          [HttpPost("request-access")]
          public IActionResult RequestAccessToCourse([FromQuery] string courseId, [FromQuery] string studentId)
          {
              try
              {
                  // Check if course exists
                  var course = _context.Repositories.FirstOrDefault(c => c.RepositoryId == courseId);
                  if (course == null) return BadRequest("Course not found");

                  // Check if student exists
                  var student = _context.Students.FirstOrDefault(s => s.StudentId == studentId);
                  if (student == null) return BadRequest("Student not found");

                  // Check if student has already requested access to the course
                  var existingRequest = _context.RepositoryAccessRequests.FirstOrDefault(r => r.CourseId == courseId && r.StudentId == studentId);
                  if (existingRequest != null) return BadRequest("Access request already exists for this student and course");

                  // Check if student has already added in course
                  var existStudInRepositorium = _context.StudentRepositories.FirstOrDefault(r => r.RepositoriesRepositoryId == courseId && r.StudentId == studentId);
                  if (existStudInRepositorium != null) return BadRequest("Student already exist in course");


                  // Create new access request
                  var accessRequest = new RepositoryAccessRequest
                  {
                      RepositoryAccessRequestId = Guid.NewGuid().ToString(),
                      CourseId = courseId,
                      StudentId = studentId,
                      Course = course,
                      Student = student,
                      RequestTime = DateTime.UtcNow
                  };

                  _context.RepositoryAccessRequests.Add(accessRequest);
                  _context.SaveChanges();

                  return Ok("Access request submitted successfully");
              }
              catch (Exception ex)
              {
                  // Log the exception
                  Console.WriteLine($"Error submitting access request: {ex.Message}");
                  return StatusCode(500, "An error occurred while submitting access request");
              }
          }

        //Endpoint for teachers to approve access requests for a course
        [HttpPost("approve-access-student-course")]
        public IActionResult ApproveAccessToCourse(/*[FromBody] StudentRepository model,*/[FromQuery] string requestId)
        {
            try
            {
                // Find the access request by requestId
                var accessRequest = _context.RepositoryAccessRequests.FirstOrDefault(r => r.RepositoryAccessRequestId == requestId);
                if (accessRequest == null)
                {
                    return BadRequest("Access request not found");
                }
                // Optionally, add more validation here (e.g., ensure teacher is authorized to approve, etc.)

                // Remove the access request
                _context.RepositoryAccessRequests.Remove(accessRequest);

                // Add student to course
                var studentCourse = new StudentRepository
                {
                    StudentRepositoryId = Guid.NewGuid().ToString(),
                    RepositoriesRepositoryId = accessRequest.CourseId,  // Set the association with a specific course (repository)
                    StudentId = accessRequest.StudentId,  // Set the student's identifier and associate them with this enrollment
                    Repository = accessRequest.Course,  // Set a reference to the course (repository) object where the student is being enrolled
                    Student = accessRequest.Student  // Set a reference to the student object being added to the course

                    // IsAccepted = false // student needs approval from teacher
                };

                // Initialize StudentRepositories if null
                /*  if (course.StudentRepositories == null)
                  {
                      course.StudentRepositories = new List<StudentRepository>();
                  }

                  if (student.StudentRepositories == null)
                  {
                      student.StudentRepositories = new List<StudentRepository>();
                  }

                  // Add the studentRepository to the collections
                  course.StudentRepositories.Add(studentCourse);
                  student.StudentRepositories.Add(studentCourse);*/


                _context.StudentRepositories.Add(studentCourse);
                _context.SaveChanges();

                return Ok("Student added to course successfully");
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error approving access request: {ex.Message}");
                return StatusCode(500, "An error occurred while approving access request");
            }
        }
    }

}



