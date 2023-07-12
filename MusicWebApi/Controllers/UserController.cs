using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.IdentityModel.Tokens;
using MusicWebApi.Data;
using MusicWebApi.Interfaces;
using MusicWebApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization;

namespace MusicWebApi.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;


        public UserController(IUserRepository userRepository, DataContext context, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _context = context;
            _configuration = configuration;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<User>))]
        public IActionResult GetUsers()
        {
            var users = _userRepository.GetUsers().ToList();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(users);
        }

        [HttpGet("{email}")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(400)]
        public IActionResult GetUser(string email)
        {
            if (!_userRepository.UserExists(email))
                return NotFound();

            var user = _userRepository.GetUser(email);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(user);
        }

        [HttpPost("register")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public IActionResult CreateUser([FromForm] User user)
        {
            if (_userRepository.UserExists(user.Email))
            {
                ModelState.AddModelError("", "User already exists");
                return StatusCode(422, ModelState);
            }
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!_userRepository.CreateUser(user.Name, user.Email, user.Password))
            {
                ModelState.AddModelError("", "Something went wrong while saving");
                return StatusCode(500, ModelState);
            }
            return Ok();
        }

        [HttpPost("login")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(400)]
        public IActionResult LoginUser([FromForm] User user)
        {
            if (_userRepository.UserExists(user.Email))
            {
                var currentUser = _userRepository.GetUser(user.Email);
                if (currentUser.Password == user.Password)
                {
                    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                    //var options = new JsonSerializerOptions{ReferenceHandler = ReferenceHandler.Preserve,};

                    var claims = new[]
                    {
                        new Claim("id", currentUser.Id.ToString()),
                        new Claim("name", currentUser.Name),
                        new Claim("email", currentUser.Email),
                        //new Claim("userMusic", JsonSerializer.Serialize(currentUser.UserMusics, options)),
                        //code that add all userMusic to token
                    };
                    var token = new JwtSecurityToken(
                        _configuration["Jwt:Issuer"], 
                        _configuration["Jwt:Audience"],
                        claims,
                        expires: DateTime.Now.AddMinutes(15),
                        signingCredentials: credentials);
                    var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
                    return Ok(JsonSerializer.Serialize(accessToken));
                }
                    
            }
            ModelState.AddModelError("", "Wrong email or password");
            return StatusCode(422, ModelState);
        } 
    }
}
