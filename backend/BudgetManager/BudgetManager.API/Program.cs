using BudgetManager.Application.Interfaces;
using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Application.Services;
using BudgetManager.Application.Validators;
using BudgetManager.Infrastructure.Data;
using BudgetManager.Infrastructure.Repositories;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//TODO mettre dans une extension method pour la DI
builder.Services.AddScoped<ITransaction, TransactionRepository>();
builder.Services.AddScoped<ICategory, CategoryRepository>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.   AddValidatorsFromAssemblyContaining<CreateTransactionDTOValidator>();

builder.Services.AddAutoMapper(cfg => { }, typeof(Program).Assembly);

var app = builder.Build();

// ❗ middleware global d'erreurs ici
app.UseExceptionHandler(appBuilder =>
{
    appBuilder.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

        context.Response.ContentType = "application/json";

        switch (exception)
        {
            case ValidationException:
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                break;

            default:
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                break;
        }

        await context.Response.WriteAsync("An error occurred");
    });
});
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // Adds the visual UI at /scalar/v1
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
