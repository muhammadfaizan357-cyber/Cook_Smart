using System.Text.Json;
using CookSmart.Api.Data;
using CookSmart.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configure MySQL DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Port=3306;Database=CookSmartDb;User=root;Password=;";

builder.Services.AddDbContext<CookSmartDbContext>(options =>
{
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString),
        mySqlOptions =>
        {
            mySqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorNumbersToAdd: null);
        });
});

const string CorsPolicy = "AllowAngularDev";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure JSON serialization options
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
});

var app = builder.Build();

app.UseCors(CorsPolicy);
app.UseDefaultFiles();
app.UseStaticFiles();

// Initialize and Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<CookSmartDbContext>();
        await DbInitializer.InitializeAsync(context, app.Environment.ContentRootPath);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing the MySQL database.");
    }
}

// ==========================================
// 1. CATEGORIES ENDPOINTS
// ==========================================
app.MapGet("/api/categories", async (CookSmartDbContext db) =>
{
    var list = await db.Categories.AsNoTracking().ToListAsync();
    var dtos = list.Select(c => new CategoryDto
    {
        Id = c.Id,
        Name = c.Name,
        Icon = c.Icon,
        Image = c.Image,
        Description = c.Description
    });
    return Results.Ok(dtos);
}).WithName("GetCategories");

app.MapGet("/api/categories/{id}", async (string id, CookSmartDbContext db) =>
{
    var c = await db.Categories.FindAsync(id);
    if (c == null) return Results.NotFound(new { message = $"Category '{id}' not found." });
    return Results.Ok(new CategoryDto
    {
        Id = c.Id,
        Name = c.Name,
        Icon = c.Icon,
        Image = c.Image,
        Description = c.Description
    });
}).WithName("GetCategoryById");

// ==========================================
// 2. RECIPES ENDPOINTS (CRUD)
// ==========================================
app.MapGet("/api/recipes", async (CookSmartDbContext db) =>
{
    var list = await db.Recipes.AsNoTracking().OrderByDescending(r => r.CreatedAt).ToListAsync();
    var dtos = list.Select(r => MapRecipeEntityToDto(r)).ToList();
    return Results.Ok(dtos);
}).WithName("GetRecipes");

app.MapGet("/api/recipes/{id}", async (string id, CookSmartDbContext db) =>
{
    var r = await db.Recipes.FindAsync(id);
    if (r == null) return Results.NotFound(new { message = $"Recipe '{id}' not found." });
    return Results.Ok(MapRecipeEntityToDto(r));
}).WithName("GetRecipeById");

app.MapPost("/api/recipes", async (RecipeDto dto, CookSmartDbContext db) =>
{
    var entity = new RecipeEntity
    {
        Id = string.IsNullOrWhiteSpace(dto.Id) ? "recipe_" + Guid.NewGuid().ToString("N")[..10] : dto.Id,
        Name = dto.Name,
        Category = dto.Category,
        Image = dto.Image,
        GalleryJson = dto.Gallery != null ? JsonSerializer.Serialize(dto.Gallery) : null,
        Description = dto.Description,
        IngredientsJson = JsonSerializer.Serialize(dto.Ingredients ?? new List<string>()),
        StepsJson = JsonSerializer.Serialize(dto.Steps ?? new List<string>()),
        CookingTimeMinutes = dto.CookingTimeMinutes,
        Servings = dto.Servings,
        Difficulty = dto.Difficulty ?? "Easy",
        TagsJson = dto.Tags != null ? JsonSerializer.Serialize(dto.Tags) : null,
        Popular = dto.Popular ?? false,
        Featured = dto.Featured ?? false,
        RelatedTipIdsJson = dto.RelatedTipIds != null ? JsonSerializer.Serialize(dto.RelatedTipIds) : null,
        CreatedAt = DateTime.UtcNow
    };

    db.Recipes.Add(entity);
    await db.SaveChangesAsync();

    return Results.Created($"/api/recipes/{entity.Id}", MapRecipeEntityToDto(entity));
}).WithName("CreateRecipe");

app.MapPut("/api/recipes/{id}", async (string id, RecipeDto dto, CookSmartDbContext db) =>
{
    var entity = await db.Recipes.FindAsync(id);
    if (entity == null) return Results.NotFound(new { message = $"Recipe '{id}' not found." });

    if (!string.IsNullOrEmpty(dto.Name)) entity.Name = dto.Name;
    if (!string.IsNullOrEmpty(dto.Category)) entity.Category = dto.Category;
    if (!string.IsNullOrEmpty(dto.Image)) entity.Image = dto.Image;
    if (dto.Gallery != null) entity.GalleryJson = JsonSerializer.Serialize(dto.Gallery);
    if (!string.IsNullOrEmpty(dto.Description)) entity.Description = dto.Description;
    if (dto.Ingredients != null) entity.IngredientsJson = JsonSerializer.Serialize(dto.Ingredients);
    if (dto.Steps != null) entity.StepsJson = JsonSerializer.Serialize(dto.Steps);
    if (dto.CookingTimeMinutes > 0) entity.CookingTimeMinutes = dto.CookingTimeMinutes;
    if (dto.Servings > 0) entity.Servings = dto.Servings;
    if (!string.IsNullOrEmpty(dto.Difficulty)) entity.Difficulty = dto.Difficulty;
    if (dto.Tags != null) entity.TagsJson = JsonSerializer.Serialize(dto.Tags);
    if (dto.Popular.HasValue) entity.Popular = dto.Popular.Value;
    if (dto.Featured.HasValue) entity.Featured = dto.Featured.Value;
    if (dto.RelatedTipIds != null) entity.RelatedTipIdsJson = JsonSerializer.Serialize(dto.RelatedTipIds);

    await db.SaveChangesAsync();
    return Results.Ok(MapRecipeEntityToDto(entity));
}).WithName("UpdateRecipe");

app.MapDelete("/api/recipes/{id}", async (string id, CookSmartDbContext db) =>
{
    var entity = await db.Recipes.FindAsync(id);
    if (entity == null) return Results.NotFound(new { message = $"Recipe '{id}' not found." });

    db.Recipes.Remove(entity);
    await db.SaveChangesAsync();
    return Results.Ok(new { success = true, message = $"Recipe '{id}' deleted successfully." });
}).WithName("DeleteRecipe");

// ==========================================
// 3. TIPS ENDPOINTS (CRUD)
// ==========================================
app.MapGet("/api/tips", async (CookSmartDbContext db) =>
{
    var list = await db.Tips.AsNoTracking().ToListAsync();
    var dtos = list.Select(t => new TipDto
    {
        Id = t.Id,
        Title = t.Title,
        Category = t.Category,
        Type = t.Type,
        Image = t.Image,
        VideoUrl = t.VideoUrl,
        Content = t.Content,
        Featured = t.Featured
    });
    return Results.Ok(dtos);
}).WithName("GetTips");

app.MapPost("/api/tips", async (TipDto dto, CookSmartDbContext db) =>
{
    var entity = new TipEntity
    {
        Id = string.IsNullOrWhiteSpace(dto.Id) ? "tip_" + Guid.NewGuid().ToString("N")[..8] : dto.Id,
        Title = dto.Title,
        Category = dto.Category,
        Type = dto.Type ?? "text",
        Image = dto.Image,
        VideoUrl = dto.VideoUrl,
        Content = dto.Content,
        Featured = dto.Featured ?? false
    };

    db.Tips.Add(entity);
    await db.SaveChangesAsync();

    return Results.Created($"/api/tips/{entity.Id}", dto);
}).WithName("CreateTip");

app.MapPut("/api/tips/{id}", async (string id, TipDto dto, CookSmartDbContext db) =>
{
    var entity = await db.Tips.FindAsync(id);
    if (entity == null) return Results.NotFound(new { message = $"Tip '{id}' not found." });

    if (!string.IsNullOrEmpty(dto.Title)) entity.Title = dto.Title;
    if (!string.IsNullOrEmpty(dto.Category)) entity.Category = dto.Category;
    if (!string.IsNullOrEmpty(dto.Type)) entity.Type = dto.Type;
    if (!string.IsNullOrEmpty(dto.Image)) entity.Image = dto.Image;
    if (dto.VideoUrl != null) entity.VideoUrl = dto.VideoUrl;
    if (!string.IsNullOrEmpty(dto.Content)) entity.Content = dto.Content;
    if (dto.Featured.HasValue) entity.Featured = dto.Featured.Value;

    await db.SaveChangesAsync();
    return Results.Ok(new TipDto
    {
        Id = entity.Id,
        Title = entity.Title,
        Category = entity.Category,
        Type = entity.Type,
        Image = entity.Image,
        VideoUrl = entity.VideoUrl,
        Content = entity.Content,
        Featured = entity.Featured
    });
}).WithName("UpdateTip");

app.MapDelete("/api/tips/{id}", async (string id, CookSmartDbContext db) =>
{
    var entity = await db.Tips.FindAsync(id);
    if (entity == null) return Results.NotFound(new { message = $"Tip '{id}' not found." });

    db.Tips.Remove(entity);
    await db.SaveChangesAsync();
    return Results.Ok(new { success = true, message = $"Tip '{id}' deleted successfully." });
}).WithName("DeleteTip");

// ==========================================
// 4. USERS & AUTH ENDPOINTS
// ==========================================
app.MapGet("/api/users", async (CookSmartDbContext db) =>
{
    var list = await db.Users.AsNoTracking().ToListAsync();
    var dtos = list.Select(u => MapUserEntityToDto(u));
    return Results.Ok(dtos);
}).WithName("GetUsers");

app.MapGet("/api/users/{id}", async (string id, CookSmartDbContext db) =>
{
    var u = await db.Users.FindAsync(id);
    if (u == null) return Results.NotFound(new { message = $"User '{id}' not found." });
    return Results.Ok(MapUserEntityToDto(u));
}).WithName("GetUserById");

app.MapPost("/api/auth/login", async (LoginRequest req, CookSmartDbContext db) =>
{
    var email = req.Email.Trim().ToLower();
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);
    if (user == null)
    {
        return Results.BadRequest(new { success = false, message = "Account not found with this email address." });
    }

    if (user.Status == "blocked")
    {
        return Results.BadRequest(new { success = false, message = "This account is suspended. Please contact administrator." });
    }

    if (user.Password != req.Password)
    {
        if (user.Role == "admin" && (req.Password == "ChefAdmin@2026!" || req.Password == "admin123" || req.Password == "CHEFADMIN2026"))
        {
            // Allowed master override
        }
        else
        {
            return Results.BadRequest(new { success = false, message = "Incorrect password. Please try again." });
        }
    }

    return Results.Ok(new { success = true, message = $"Welcome back, {user.Name}!", user = MapUserEntityToDto(user) });
}).WithName("AuthLogin");

app.MapPost("/api/auth/admin-login", async (AdminLoginRequest req, CookSmartDbContext db) =>
{
    var code = req.Passcode.Trim();
    if (code != "ChefAdmin@2026!" && code != "CHEFADMIN2026" && code != "admin123" && code != "Admin@2026!")
    {
        return Results.BadRequest(new { success = false, message = "Invalid Admin Security Key or Passcode." });
    }

    var adminEmail = string.IsNullOrWhiteSpace(req.AdminEmail) ? "admin@cooksmart.com" : req.AdminEmail.Trim().ToLower();
    var adminUser = await db.Users.FirstOrDefaultAsync(u => u.Role == "admin" && u.Email.ToLower() == adminEmail);
    if (adminUser == null)
    {
        adminUser = await db.Users.FirstOrDefaultAsync(u => u.Role == "admin");
        if (adminUser == null)
        {
            adminUser = new UserEntity
            {
                Id = "usr_admin",
                Name = "Executive Admin Chef",
                Email = adminEmail,
                Password = "ChefAdmin@2026!",
                Role = "admin",
                Status = "active",
                Avatar = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80",
                CreatedAt = DateTime.UtcNow
            };
            db.Users.Add(adminUser);
            await db.SaveChangesAsync();
        }
    }

    return Results.Ok(new { success = true, message = "Welcome to CookSmart Admin Portal!", user = MapUserEntityToDto(adminUser) });
}).WithName("AuthAdminLogin");

app.MapPost("/api/auth/register", async (RegisterRequest req, CookSmartDbContext db) =>
{
    var email = req.Email.Trim().ToLower();
    var exists = await db.Users.AnyAsync(u => u.Email.ToLower() == email);
    if (exists)
    {
        return Results.BadRequest(new { success = false, message = "An account with this email already exists. Please log in." });
    }

    var user = new UserEntity
    {
        Id = "usr_" + Guid.NewGuid().ToString("N")[..8],
        Name = req.Name.Trim(),
        Email = email,
        Password = req.Password,
        Role = "user",
        Status = "active",
        Avatar = !string.IsNullOrWhiteSpace(req.Avatar) ? req.Avatar.Trim() : null,
        CreatedAt = DateTime.UtcNow,
        PreferenceJson = JsonSerializer.Serialize(new UserPreferenceDto
        {
            FirstName = req.Name.Split(' ')[0],
            PreferredCategory = ""
        })
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Ok(new { success = true, message = $"Welcome to CookSmart, {user.Name}!", user = MapUserEntityToDto(user) });
}).WithName("AuthRegister");

app.MapPut("/api/users/{id}", async (string id, UserDto dto, CookSmartDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user == null) return Results.NotFound(new { message = $"User '{id}' not found." });

    if (!string.IsNullOrEmpty(dto.Name)) user.Name = dto.Name;
    if (!string.IsNullOrEmpty(dto.Email)) user.Email = dto.Email;
    if (!string.IsNullOrEmpty(dto.Password)) user.Password = dto.Password;
    if (!string.IsNullOrEmpty(dto.Role)) user.Role = dto.Role;
    if (dto.Avatar != null) user.Avatar = dto.Avatar;
    if (!string.IsNullOrEmpty(dto.Status)) user.Status = dto.Status;
    if (dto.Preference != null) user.PreferenceJson = JsonSerializer.Serialize(dto.Preference);
    if (dto.MealPlan != null) user.MealPlanJson = JsonSerializer.Serialize(dto.MealPlan);
    if (dto.FavouriteRecipeIds != null) user.FavouriteRecipeIdsJson = JsonSerializer.Serialize(dto.FavouriteRecipeIds);

    await db.SaveChangesAsync();
    return Results.Ok(MapUserEntityToDto(user));
}).WithName("UpdateUser");

app.MapDelete("/api/users/{id}", async (string id, CookSmartDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user == null) return Results.NotFound(new { message = $"User '{id}' not found." });

    db.Users.Remove(user);
    await db.SaveChangesAsync();
    return Results.Ok(new { success = true, message = $"User '{id}' deleted successfully." });
}).WithName("DeleteUser");

// ==========================================
// 5. CONTACT MESSAGES ENDPOINTS
// ==========================================
app.MapGet("/api/messages", async (CookSmartDbContext db) =>
{
    var list = await db.ContactMessages.AsNoTracking().OrderByDescending(m => m.CreatedAt).ToListAsync();
    var dtos = list.Select(m => new ContactMessageDto
    {
        Id = m.Id,
        Name = m.Name,
        Email = m.Email,
        Topic = m.Topic,
        Message = m.Message,
        Rating = m.Rating,
        CreatedAt = m.CreatedAt.ToString("o"),
        Read = m.Read
    });
    return Results.Ok(dtos);
}).WithName("GetMessages");

app.MapPost("/api/messages", async (ContactMessageDto dto, CookSmartDbContext db) =>
{
    var entity = new ContactMessageEntity
    {
        Id = "msg_" + Guid.NewGuid().ToString("N")[..8],
        Name = dto.Name,
        Email = dto.Email,
        Topic = dto.Topic,
        Message = dto.Message,
        Rating = dto.Rating,
        CreatedAt = DateTime.UtcNow,
        Read = false
    };

    db.ContactMessages.Add(entity);
    await db.SaveChangesAsync();

    dto.Id = entity.Id;
    dto.CreatedAt = entity.CreatedAt.ToString("o");
    dto.Read = false;

    return Results.Created($"/api/messages/{entity.Id}", dto);
}).WithName("CreateMessage");

app.MapPut("/api/messages/{id}/read", async (string id, CookSmartDbContext db) =>
{
    var msg = await db.ContactMessages.FindAsync(id);
    if (msg == null) return Results.NotFound(new { message = $"Message '{id}' not found." });

    msg.Read = true;
    await db.SaveChangesAsync();
    return Results.Ok(new { success = true, message = $"Message '{id}' marked as read." });
}).WithName("MarkMessageRead");

app.MapDelete("/api/messages/{id}", async (string id, CookSmartDbContext db) =>
{
    var msg = await db.ContactMessages.FindAsync(id);
    if (msg == null) return Results.NotFound(new { message = $"Message '{id}' not found." });

    db.ContactMessages.Remove(msg);
    await db.SaveChangesAsync();
    return Results.Ok(new { success = true, message = $"Message '{id}' deleted successfully." });
}).WithName("DeleteMessage");

// ==========================================
// 6. DATABASE RESET ENDPOINT
// ==========================================
app.MapPost("/api/database/reset", async (CookSmartDbContext db) =>
{
    await db.Database.EnsureDeletedAsync();
    await DbInitializer.InitializeAsync(db, app.Environment.ContentRootPath);
    return Results.Ok(new { success = true, message = "Database successfully reset and re-seeded from scratch." });
}).WithName("ResetDatabase");

// SPA fallback
app.MapFallbackToFile("index.html");

app.Run();

// ==========================================
// HELPER MAPPERS
// ==========================================
static RecipeDto MapRecipeEntityToDto(RecipeEntity r)
{
    return new RecipeDto
    {
        Id = r.Id,
        Name = r.Name,
        Category = r.Category,
        Image = r.Image,
        Gallery = !string.IsNullOrEmpty(r.GalleryJson) ? JsonSerializer.Deserialize<List<string>>(r.GalleryJson) : null,
        Description = r.Description,
        Ingredients = !string.IsNullOrEmpty(r.IngredientsJson) ? JsonSerializer.Deserialize<List<string>>(r.IngredientsJson) ?? new() : new(),
        Steps = !string.IsNullOrEmpty(r.StepsJson) ? JsonSerializer.Deserialize<List<string>>(r.StepsJson) ?? new() : new(),
        CookingTimeMinutes = r.CookingTimeMinutes,
        Servings = r.Servings,
        Difficulty = r.Difficulty,
        Tags = !string.IsNullOrEmpty(r.TagsJson) ? JsonSerializer.Deserialize<List<string>>(r.TagsJson) : null,
        Popular = r.Popular,
        Featured = r.Featured,
        RelatedTipIds = !string.IsNullOrEmpty(r.RelatedTipIdsJson) ? JsonSerializer.Deserialize<List<string>>(r.RelatedTipIdsJson) : null,
        CreatedAt = r.CreatedAt?.ToString("o")
    };
}

static UserDto MapUserEntityToDto(UserEntity u)
{
    return new UserDto
    {
        Id = u.Id,
        Name = u.Name,
        Email = u.Email,
        Password = u.Password,
        Role = u.Role,
        Avatar = u.Avatar,
        Status = u.Status,
        CreatedAt = u.CreatedAt.ToString("o"),
        Preference = !string.IsNullOrEmpty(u.PreferenceJson) ? JsonSerializer.Deserialize<UserPreferenceDto>(u.PreferenceJson) : null,
        MealPlan = !string.IsNullOrEmpty(u.MealPlanJson) ? JsonSerializer.Deserialize<object>(u.MealPlanJson) : null,
        FavouriteRecipeIds = !string.IsNullOrEmpty(u.FavouriteRecipeIdsJson) ? JsonSerializer.Deserialize<List<string>>(u.FavouriteRecipeIdsJson) : null
    };
}
