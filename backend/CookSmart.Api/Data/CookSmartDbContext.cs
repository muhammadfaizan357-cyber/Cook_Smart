using Microsoft.EntityFrameworkCore;
using CookSmart.Api.Models;

namespace CookSmart.Api.Data;

public class CookSmartDbContext : DbContext
{
    public CookSmartDbContext(DbContextOptions<CookSmartDbContext> options)
        : base(options)
    {
    }

    public DbSet<CategoryEntity> Categories => Set<CategoryEntity>();
    public DbSet<RecipeEntity> Recipes => Set<RecipeEntity>();
    public DbSet<TipEntity> Tips => Set<TipEntity>();
    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<ContactMessageEntity> ContactMessages => Set<ContactMessageEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<CategoryEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Icon).HasMaxLength(100);
            entity.Property(e => e.Image).HasMaxLength(500);
            entity.Property(e => e.Description).HasColumnType("text");
        });

        modelBuilder.Entity<RecipeEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(64);
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Category).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Image).HasColumnType("longtext");
            entity.Property(e => e.GalleryJson).HasColumnType("text");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.IngredientsJson).HasColumnType("longtext").IsRequired();
            entity.Property(e => e.StepsJson).HasColumnType("longtext").IsRequired();
            entity.Property(e => e.Difficulty).HasMaxLength(20).HasDefaultValue("Easy");
            entity.Property(e => e.TagsJson).HasColumnType("text");
            entity.Property(e => e.RelatedTipIdsJson).HasColumnType("text");
        });

        modelBuilder.Entity<TipEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(64);
            entity.Property(e => e.Title).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Category).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Type).HasMaxLength(20).HasDefaultValue("text");
            entity.Property(e => e.Image).HasColumnType("longtext");
            entity.Property(e => e.VideoUrl).HasMaxLength(500);
            entity.Property(e => e.Content).HasColumnType("text");
        });

        modelBuilder.Entity<UserEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(64);
            entity.Property(e => e.Name).HasMaxLength(150).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(150).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Role).HasMaxLength(20).HasDefaultValue("user");
            entity.Property(e => e.Avatar).HasColumnType("longtext");
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("active");
            entity.Property(e => e.PreferenceJson).HasColumnType("text");
            entity.Property(e => e.MealPlanJson).HasColumnType("longtext");
            entity.Property(e => e.FavouriteRecipeIdsJson).HasColumnType("text");
        });

        modelBuilder.Entity<ContactMessageEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(64);
            entity.Property(e => e.Name).HasMaxLength(150).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(150).IsRequired();
            entity.Property(e => e.Topic).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Message).HasColumnType("text").IsRequired();
        });
    }
}
