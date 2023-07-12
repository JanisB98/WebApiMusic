using MusicWebApi.Models;

namespace MusicWebApi.Interfaces
{
    public interface IUserRepository
    {
        ICollection<User> GetUsers();
        ICollection<User> GetUsersIncludingUserMusics();
        User GetUser(string email);
        bool UserExists(string email);
        bool CreateUser(string name, string email, string password);
        bool SaveUser();
    }
}
