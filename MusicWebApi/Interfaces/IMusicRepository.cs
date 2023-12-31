﻿using MusicWebApi.Models;

namespace MusicWebApi.Interfaces
{
    public interface IMusicRepository
    {
        ICollection<Music> GetMusics();
        Music GetMusic(string title);
        List<UserMusic> GetMusicsByUser(int userId);
        bool MusicExists(string email);
        bool DeleteUserMusic(int userId, int musicId);
        bool DeleteMusic(int musicId);
        bool CreateMusic(string title, string path);
        bool CreateUserMusic(int userId, int musicId);
        bool SaveMusic();
    }
}
