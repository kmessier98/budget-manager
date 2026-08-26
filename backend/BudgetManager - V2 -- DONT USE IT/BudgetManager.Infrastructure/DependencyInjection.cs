using BudgetManager.Application.Interfaces.Category;
using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace BudgetManager.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureService(this IServiceCollection services)
        {
            services.AddScoped<ITransaction, TransactionRepository>();
            services.AddScoped<ICategory, CategoryRepository>();

            return services;
        }
    }
}
