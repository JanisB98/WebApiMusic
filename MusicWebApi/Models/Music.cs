namespace MusicWebApi.Models
{
    public class Music
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Path { get; set; }
        public ICollection<UserMusic> UserMusics { get; set; }
    }
}
