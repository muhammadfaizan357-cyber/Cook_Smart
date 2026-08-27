using System.Text.Json;
using CookSmart.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CookSmart.Api.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(CookSmartDbContext context, string contentRootPath)
    {
        // Ensure database and schema exist
        await context.Database.EnsureCreatedAsync();

        var dataFolder = Path.Combine(contentRootPath, "Data");

        // 1. Seed Categories if empty
        if (!await context.Categories.AnyAsync())
        {
            var categoriesFile = Path.Combine(dataFolder, "categories.json");
            if (File.Exists(categoriesFile))
            {
                var json = await File.ReadAllTextAsync(categoriesFile);
                var dtos = JsonSerializer.Deserialize<List<CategoryDto>>(json);
                if (dtos != null && dtos.Count > 0)
                {
                    var entities = dtos.Select(d => new CategoryEntity
                    {
                        Id = d.Id,
                        Name = d.Name,
                        Icon = d.Icon,
                        Image = d.Image,
                        Description = d.Description
                    }).ToList();

                    await context.Categories.AddRangeAsync(entities);
                    await context.SaveChangesAsync();
                }
            }
        }

        // 2. Seed Tips if empty
        if (!await context.Tips.AnyAsync())
        {
            var tipsFile = Path.Combine(dataFolder, "tips.json");
            if (File.Exists(tipsFile))
            {
                var json = await File.ReadAllTextAsync(tipsFile);
                var dtos = JsonSerializer.Deserialize<List<TipDto>>(json);
                if (dtos != null && dtos.Count > 0)
                {
                    var entities = dtos.Select(d => new TipEntity
                    {
                        Id = d.Id,
                        Title = d.Title,
                        Category = d.Category,
                        Type = d.Type,
                        Image = d.Image,
                        VideoUrl = d.VideoUrl,
                        Content = d.Content,
                        Featured = d.Featured ?? false
                    }).ToList();

                    await context.Tips.AddRangeAsync(entities);
                    await context.SaveChangesAsync();
                }
            }
        }

        // 3. Seed Recipes if empty
        if (!await context.Recipes.AnyAsync())
        {
            var recipesFile = Path.Combine(dataFolder, "recipes.json");
            if (File.Exists(recipesFile))
            {
                var json = await File.ReadAllTextAsync(recipesFile);
                var dtos = JsonSerializer.Deserialize<List<RecipeDto>>(json);
                if (dtos != null && dtos.Count > 0)
                {
                    var entities = dtos.Select(d => new RecipeEntity
                    {
                        Id = d.Id,
                        Name = d.Name,
                        Category = d.Category,
                        Image = d.Image,
                        GalleryJson = d.Gallery != null ? JsonSerializer.Serialize(d.Gallery) : null,
                        Description = d.Description,
                        IngredientsJson = JsonSerializer.Serialize(d.Ingredients),
                        StepsJson = JsonSerializer.Serialize(d.Steps),
                        CookingTimeMinutes = d.CookingTimeMinutes,
                        Servings = d.Servings,
                        Difficulty = d.Difficulty,
                        TagsJson = d.Tags != null ? JsonSerializer.Serialize(d.Tags) : null,
                        Popular = d.Popular ?? false,
                        Featured = d.Featured ?? false,
                        RelatedTipIdsJson = d.RelatedTipIds != null ? JsonSerializer.Serialize(d.RelatedTipIds) : null,
                        CreatedAt = DateTime.UtcNow
                    }).ToList();

                    await context.Recipes.AddRangeAsync(entities);
                    await context.SaveChangesAsync();
                }
            }
        }

        // 4. Seed Users if empty
        if (!await context.Users.AnyAsync())
        {
            var initialUsers = new List<UserEntity>
            {
                new UserEntity
                {
                    Id = "usr_admin",
                    Name = "Master Chef Admin",
                    Email = "admin@cooksmart.com",
                    Password = "ChefAdmin@2026!",
                    Role = "admin",
                    Avatar = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80",
                    Status = "active",
                    CreatedAt = DateTime.UtcNow
                },
                new UserEntity
                {
                    Id = "usr_sarah",
                    Name = "Sarah Khan",
                    Email = "sarah@example.com",
                    Password = "user123",
                    Role = "user",
                    Avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
                    Status = "active",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    PreferenceJson = JsonSerializer.Serialize(new UserPreferenceDto { FirstName = "Sarah", PreferredCategory = "breakfast" })
                }
            };

            await context.Users.AddRangeAsync(initialUsers);
            await context.SaveChangesAsync();
        }

        // 5. Seed Initial Sample Messages if empty
        if (!await context.ContactMessages.AnyAsync())
        {
            var initialMessages = new List<ContactMessageEntity>
            {
                new ContactMessageEntity
                {
                    Id = "msg_1",
                    Name = "Hassan Raza",
                    Email = "hassan@example.com",
                    Topic = "Recipe Request",
                    Message = "Could you please add more healthy keto dinner ideas and air fryer snacks?",
                    Rating = 5,
                    CreatedAt = DateTime.UtcNow.AddHours(-12),
                    Read = false
                },
                new ContactMessageEntity
                {
                    Id = "msg_2",
                    Name = "Fatima Noor",
                    Email = "fatima.n@example.com",
                    Topic = "General Feedback",
                    Message = "Loving the meal planner and AI suggestion feature! Very smooth experience.",
                    Rating = 5,
                    CreatedAt = DateTime.UtcNow.AddHours(-48),
                    Read = true
                }
            };

            await context.ContactMessages.AddRangeAsync(initialMessages);
            await context.SaveChangesAsync();
        }
    }
}
