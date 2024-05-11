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

namespace WAP_Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly DataContext _context;

        public AuthController(ILogger<AuthController> logger, DataContext context)
        {
            _logger = logger;
            _context = context;
        }

        // Mock database for storing users
        private static readonly List<User> _users = new List<User>();
        private static readonly List<Student> _usersStudent = new List<Student>();
        private static readonly List<Teacher> _usersTeacher = new List<Teacher>();
        private static readonly List<UserToken> _usersTokens = new List<UserToken>();

        // Register endpoint
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterModel model)
        {

            //// Check if username already exists
            //if (_context.Users.Any(u => u.Username == model.Username))
            //{
            //    return BadRequest("Username already exists");
            //}

            //// We should hash the password before storing it
            //var newUser = new User
            //{
            //    Id = Guid.NewGuid().ToString(),
            //    Username = model.Username,
            //    Password = model.Password,
            //    Role = model.Role
            //};
            //_context.Users.Add(newUser);
            //_context.SaveChanges();

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
            //// Check if user exists
            //var user = _users.SingleOrDefault(u => u.Username == model.Username && u.Password == model.Password);
            //if (user == null)
            //{
            //    return BadRequest("Invalid username or password");
            //}

            //try
            //{
            //    var student = _usersStudent.FirstOrDefault(u => u.Username == model.Username && u.PasswordHash == model.Password);
            //    var teacher = _usersTeacher.FirstOrDefault(u => u.Username.Equals(model.Username) && u.PasswordHash.Equals(model.Password));
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine($"Error: {ex.Message}");
            //    return BadRequest("An error occurred while processing your request.");
            //}


            Console.WriteLine($"Username: {model.Username}, PasswordHash: {model.PasswordHash}");
            Console.WriteLine($"Searching for student: Username = {model.Username}, PasswordHash = {model.PasswordHash}");
            //если Username одинаковые в ученике и учителе?
            var student = _context.Students
                .FirstOrDefault(u => u.Username == model.Username && u.PasswordHash == model.PasswordHash);
            if (student != null) return GenerateAndReturnToken(student.StudentId, student.PasswordHash);

            Console.WriteLine($"Searching for teacher: Username = {model.Username}, PasswordHash = {model.PasswordHash}");
           
            var teacher = _context.Teachers
                .FirstOrDefault(u => u.Username == model.Username && u.PasswordHash == model.PasswordHash); 
            if (teacher != null) return GenerateAndReturnToken(teacher.TeacherId, teacher.PasswordHash);
           
            //_context.SaveChanges();
            return BadRequest("Invalid username or password");
           
            
            //// Create JWT token
            //var token = GenerateJwtToken(user);
            //return Ok(new { Token = token });
        }

        private IActionResult GenerateAndReturnToken(string username, string role)
        {
            // Check if token already exists for this user
            var existingToken = _context.UserTokens.FirstOrDefault(t => t.UserId == username);
            if (existingToken != null)
            {
                // Token already exists, return it
                return Ok(new { Token = existingToken.Token });
            }

            // Create JWT token
            var token = GenerateJwtToken(username, role);
            AddTokenToDatabase(username, token);
            return Ok(new { Token = token });
        }

        //не возврашает токен   _context.SaveChanges(); ОШИБКА
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
    }

    
}

// Models for registration and login
    public class UserRegisterModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }

    public class UserLoginModel
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
    }

    // Mock user model (in a real-world scenario, use a proper user model with data annotations)
    //public class User
    //{
    //    public string Id { get; set; }
    //    public string Username { get; set; }
    //    public string Password { get; set; }
    //    public string Role { get; set; }
    //}

    //public class Student
    //{
    //    public string StudentId { get; set; }
    ////    public string Username { get; set; }
    //    public string PasswordHash { get; set; }
    //    public string Role { get; set; }
    //    public string Token { get; set; } // Опционально: может быть обновлено после регистрации/входа
    //}

