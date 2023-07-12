namespace MusicWebApi.Models
{
    public class FileUpload
    {
        public string Title { get; set; }
        public IFormFile FormFile { get; set; }
    }
}
