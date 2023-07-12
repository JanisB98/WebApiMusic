namespace MusicWebApi.Models
{
    public class UserMusic
    {
        public int UserId { get; set; }
        public int MusicId { get; set; }
        public User User { get; set; }
        public Music Music { get; set; }
    }
}
