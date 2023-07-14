using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.IdentityModel.Tokens;
using MusicWebApi.Data;
using MusicWebApi.Interfaces;
using MusicWebApi.Models;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MusicWebApi.Controllers
{
    [Route("api/music")]
    [ApiController]
    public class MusicController : Controller
    {
        private readonly IMusicRepository _musicRepository;
        private readonly IUserRepository _userRepository;
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public MusicController(IUserRepository userRepository, IMusicRepository musicRepository, DataContext context, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _musicRepository = musicRepository;
            _context = context;
            _configuration = configuration;
        }

        [HttpGet]
        [ProducesResponseType(200)]
        public IActionResult GetMusics()
        {
            var musics = _musicRepository.GetMusics();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(musics);
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(200)]
        public IActionResult GetMusicsByUser(int userId)
        {
            var musics = _musicRepository.GetMusicsByUser(userId);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(musics);
        }

        [HttpGet("title/{title}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public IActionResult GetMusic(string title)
        {
            if (!_musicRepository.MusicExists(title))
                return NotFound();

            var music = _musicRepository.GetMusic(title);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(music);
        }

        [HttpPost("upload")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public IActionResult UploadFile([FromForm] FileUpload file)
        {
            try
            {
                var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                var userId = Int32.Parse(jwtToken.Claims.FirstOrDefault(c => c.Type == "id")?.Value);

                var folderPath = Path.Combine("ClientApp", "src", "music");
                Directory.CreateDirectory(folderPath);

                string dataBasePath = file.Title;

                if (!Path.GetExtension(file.Title).Equals(".mp3", StringComparison.OrdinalIgnoreCase))
                {
                    dataBasePath = Path.ChangeExtension(file.Title, ".mp3");
                }

                string filePath = Path.Combine(folderPath, file.Title);

                if (!_musicRepository.CreateMusic(file.Title.Replace(".mp3", ""), dataBasePath))
                {
                    ModelState.AddModelError("", "Something went wrong while saving");
                    return StatusCode(500, ModelState);
                }

                var currentMusic = _musicRepository.GetMusic(file.Title.Replace(".mp3", ""));

                if (!_musicRepository.CreateUserMusic(userId, currentMusic.Id))
                {
                    ModelState.AddModelError("", "Something went wrong while saving");
                    return StatusCode(500, ModelState);
                }


                using (Stream stream = new FileStream(filePath, FileMode.Create))
                {
                    file.FormFile.CopyTo(stream);
                }
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest(ModelState);
            }
        }
    }
}
