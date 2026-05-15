using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Domain.Entities;
using BudgetManager.Infrastructure.Data;
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
            //todo juste retourné entity (tracker)
            var createdTransaction = (await _dbContext.Transactions.AddAsync(entity)).Entity;
            await _dbContext.SaveChangesAsync();

            return createdTransaction;
        }

        public Task DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<Transaction?> FindByIdAsync(Guid id)
        {
            throw new NotImplementedException();
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
