using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Domain.Entities;
using BudgetManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BudgetManager.Infrastructure.Repositories
{
    public class TransactionRepository : ITransaction
    {
        private readonly AppDbContext _dbContext;

        public TransactionRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Transaction> CreateAsync(Transaction entity)
        {
            await _dbContext.Transactions.AddAsync(entity);
            await _dbContext.SaveChangesAsync();

            return entity;
        }

        public Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<Transaction?> FindByIdAsync(Guid id)
        {
            return await _dbContext.Transactions
                .Include(c => c.Category)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public Task<IEnumerable<Transaction>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Transaction?> GetByAsync(Expression<Func<Transaction, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<Transaction> UpdateAsync(Transaction entity)
        {
            throw new NotImplementedException();
        }
    }
}
