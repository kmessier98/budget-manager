using BudgetManager.Application.Interfaces;
using BudgetManager.Domain.Entities;
using BudgetManager.Infrastructure.Data;
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

        public Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<Category?> FindByIdAsync(Guid id)
        {
            return await _dbContext.Categories.FindAsync(id);
        }

        public Task<IEnumerable<Category>> GetAllAsync()
        {
            throw new NotImplementedException();
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
