using Microsoft.EntityFrameworkCore;
using StudentDashboard.Api.Data;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using StudentDashboard.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// 🔧 Add services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Register your DbContext with PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile("firebase/serviceAccountKey.json")
});

// 🔧 Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseFirebaseAuthentication();
app.UseAuthorization();
app.MapControllers(); // Enable API routing
app.Run();
