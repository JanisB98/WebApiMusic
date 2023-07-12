using Microsoft.EntityFrameworkCore;
using MusicWebApi.Data;
using MusicWebApi.Interfaces;
using MusicWebApi.Models;

namespace MusicWebApi.Repository
{
    public class MusicRepository : IMusicRepository
    {
        private readonly DataContext _context;

        public MusicRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Music> GetMusics()
        {
            return _context.Musics.OrderBy(p => p.Id).ToList();
        }
        public Music GetMusic(string title)
        {
            return _context.Musics.Where(p => p.Title == title).FirstOrDefault();
        }
        public List<UserMusic> GetMusicsByUser(int userId)
        {
            return _context.UserMusics
                .Where(p => p.UserId == userId)
                .Include(p => p.Music) // Include the associated Music entities
                .ToList();
        }
        public bool CreateMusic(string titel, string path)
        {
            var music = new Music()
            {
                Title = titel,
                Path = path,
            };
            _context.Add(music);
            return SaveMusic();
        }

        public bool CreateUserMusic(int userId, int musicId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            var music = _context.Musics.FirstOrDefault(m => m.Id == musicId);

            if (user == null || music == null)
            {
                return false;
            }

            var userMusic = new UserMusic
            {
                UserId = userId,
                MusicId = musicId,
                User = user,
                Music = music
            };

            _context.UserMusics.Add(userMusic);
            return SaveMusic();
        }

        public bool MusicExists(string titel)
        {
            return _context.Musics.Any(p => p.Title == titel);
        }
        public bool SaveMusic()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
