using Microsoft.EntityFrameworkCore;
using MusicWebApi.Data;
using MusicWebApi.Interfaces;
using MusicWebApi.Models;

namespace MusicWebApi.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<User> GetUsers()
        {
            return _context.Users
                .Include(u => u.UserMusics)
                .ThenInclude(um => um.Music)
                .ToList();
        }
        public User GetUser(string email)
        {
            return _context.Users.Where(p => p.Email == email).FirstOrDefault();
        }
        public bool CreateUser(string name, string email, string password)
        {
            var user = new User()
            {
                Name = name,
                Email = email,
                Password = password,
            };
            _context.Add(user);
            return SaveUser();
        }
        public ICollection<User> GetUsersIncludingUserMusics()
        {
            return _context.Users.Include(u => u.UserMusics).ToList();
        }
        public bool UserExists(string email)
        {
            return _context.Users.Any(p => p.Email == email);
        }
        public bool SaveUser()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
