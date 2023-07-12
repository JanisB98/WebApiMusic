using Microsoft.EntityFrameworkCore;
using MusicWebApi.Models;

namespace MusicWebApi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> option) : base(option)
        {
        
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Music> Musics { get; set; }
        public DbSet<UserMusic> UserMusics { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserMusic>()
                .HasKey(pc => new {pc.UserId, pc.MusicId});
            modelBuilder.Entity<UserMusic>()
                .HasOne(p => p.User)
                .WithMany(pc => pc.UserMusics)
                .HasForeignKey(p => p.UserId);
            modelBuilder.Entity<UserMusic>()
                .HasOne(p => p.Music)
                .WithMany(pc => pc.UserMusics)
                .HasForeignKey(c => c.MusicId);
        }

    }
}
