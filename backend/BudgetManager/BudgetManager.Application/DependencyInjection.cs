using BudgetManager.Application.Interfaces.Category;
using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace BudgetManager.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ITransactionService, TransactionService>();
            services.AddScoped<ICategoryService, CategoryService>();

            return services;
        }
    }
}
