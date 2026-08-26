using BudgetManager.Application.Interfaces.Category;
using BudgetManager.Domain.Entities;
using BudgetManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Linq.Expressions;

namespace BudgetManager.Infrastructure.Repositories
{
    public class CategoryRepository : ICategory
    {
        private readonly AppDbContext _dbContext;

        public CategoryRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<Category> CreateAsync(Category entity)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<Category?> FindByIdAsync(Guid id)
        {
            return await _dbContext.Categories.FindAsync(id);
        }

        public async Task<IReadOnlyList<Category>> GetAllAsync()
        {
            return await _dbContext.Categories
                .OrderBy(c => c.Name == "Autres" ? 1 : 0) // Place "Autres" at the end of the list
                .AsNoTracking()
                .ToListAsync();
        }

        public Task<Category?> GetByAsync(Expression<Func<Category, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<Category> UpdateAsync(Category entity)
        {
            throw new NotImplementedException();
        }
    }
}
