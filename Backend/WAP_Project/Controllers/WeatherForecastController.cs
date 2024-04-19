using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace WAP_Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        // Mock database for storing users
        private static readonly List<User> _users = new List<User>();

        // Register endpoint
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterModel model)
        {
            // Check if username already exists
            if (_users.Any(u => u.Username == model.Username))
            {
                return BadRequest("Username already exists");
            }

            // We should hash the password before storing it
            var newUser = new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = model.Username,
                Password = model.Password,
                Role = model.Role
            };

            _users.Add(newUser);

            return Ok("User registered successfully!");
        }

        // Login endpoint
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginModel model)
        {
            // Check if user exists
            var user = _users.SingleOrDefault(u => u.Username == model.Username && u.Password == model.Password);

            if (user == null)
            {
                return BadRequest("Invalid username or password!");
            }

            // Create JWT token
            var token = GenerateJwtToken(user);

            return Ok(new { Token = token });
        }

        // Helper method to generate JWT token
        private string GenerateJwtToken(User user)
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
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        }),
                Expires = DateTime.UtcNow.AddDays(7), // Token expires in 7 days
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
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
        public string Password { get; set; }
    }

    // Mock user model (in a real-world scenario, use a proper user model with data annotations)
    public class User
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}
