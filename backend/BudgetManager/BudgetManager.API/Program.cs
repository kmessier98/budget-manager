using BudgetManager.API.Filters;
using BudgetManager.API.Filters.BudgetManager.API.Filters;
using BudgetManager.API.Middlewares;
using BudgetManager.Application.Interfaces.Category;
using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Application.Mappings;
using BudgetManager.Application.Services;
using BudgetManager.Application.Validators;
using BudgetManager.Infrastructure.Data;
using BudgetManager.Infrastructure.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Ajout du service Problem Details standard
builder.Services.AddProblemDetails();
// Enregistrement du gestionnaire global
builder.Services.AddExceptionHandler<GlobalExceptionHandler>(); 

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>(); // Ajout notre filtre automatiquement
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

//  Enregistrement de TOUS les validateurs du projet Application (via le package moderne)
builder.Services.AddValidatorsFromAssemblyContaining<CreateTransactionDTOValidator>();

builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//TODO mettre dans une extension method pour la DI
builder.Services.AddScoped<ITransaction, TransactionRepository>();
builder.Services.AddScoped<ICategory, CategoryRepository>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();


// On cible l'assembly du validateur pour être sûr de scanner le projet Application
builder.Services.AddAutoMapper(cfg => { }, typeof(MappingProfile).Assembly);

var app = builder.Build();

// Ajout du middleware au pipeline
app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // Adds the visual UI at /scalar/v1
}

app.UseHttpsRedirection();

app.UseCors("frontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
