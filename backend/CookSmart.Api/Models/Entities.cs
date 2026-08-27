using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CookSmart.Api.Models;

// ==========================================
// CATEGORY
// ==========================================
[Table("Categories")]
public class CategoryEntity
{
    [Key]
    [MaxLength(50)]
    public string Id { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Icon { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Image { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string Description { get; set; } = string.Empty;
}

// ==========================================
// RECIPE
// ==========================================
[Table("Recipes")]
public class RecipeEntity
{
    [Key]
    [MaxLength(64)]
    public string Id { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Column(TypeName = "longtext")]
    public string Image { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string? GalleryJson { get; set; }

    [Column(TypeName = "text")]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "longtext")]
    public string IngredientsJson { get; set; } = "[]";

    [Column(TypeName = "longtext")]
    public string StepsJson { get; set; } = "[]";

    public int CookingTimeMinutes { get; set; }

    public int Servings { get; set; }

    [MaxLength(20)]
    public string Difficulty { get; set; } = "Easy";

    [Column(TypeName = "text")]
    public string? TagsJson { get; set; }

    public bool Popular { get; set; }

    public bool Featured { get; set; }

    [Column(TypeName = "text")]
    public string? RelatedTipIdsJson { get; set; }

    public DateTime? CreatedAt { get; set; }
}

// ==========================================
// TIP
// ==========================================
[Table("Tips")]
public class TipEntity
{
    [Key]
    [MaxLength(64)]
    public string Id { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(20)]
    public string Type { get; set; } = "text";

    [Column(TypeName = "longtext")]
    public string Image { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? VideoUrl { get; set; }

    [Column(TypeName = "text")]
    public string Content { get; set; } = string.Empty;

    public bool Featured { get; set; }
}

// ==========================================
// USER
// ==========================================
[Table("Users")]
public class UserEntity
{
    [Key]
    [MaxLength(64)]
    public string Id { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Password { get; set; }

    [MaxLength(20)]
    public string Role { get; set; } = "user";

    [Column(TypeName = "longtext")]
    public string? Avatar { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "active";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "text")]
    public string? PreferenceJson { get; set; }

    [Column(TypeName = "longtext")]
    public string? MealPlanJson { get; set; }

    [Column(TypeName = "text")]
    public string? FavouriteRecipeIdsJson { get; set; }
}

// ==========================================
// CONTACT MESSAGE
// ==========================================
[Table("ContactMessages")]
public class ContactMessageEntity
{
    [Key]
    [MaxLength(64)]
    public string Id { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Topic { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string Message { get; set; } = string.Empty;

    public int Rating { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("IsRead")]
    public bool Read { get; set; }
}
