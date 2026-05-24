using BudgetManager.Application.Common;
using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Application.Queries;
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

        public async Task<bool> DeleteAsync(Guid id)
        {
            int rowsDeleted = await _dbContext.Transactions
                .Where(t => t.Id == id)
                .ExecuteDeleteAsync();

            return rowsDeleted > 0;
        }

        public async Task<Transaction?> FindByIdAsync(Guid id)
        {
            return await _dbContext.Transactions
                .AsNoTracking()
                .Include(c => c.Category)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IReadOnlyList<Transaction>> GetAllAsync()
        {
            return await _dbContext.Transactions
                .AsNoTracking()
                .Include(c => c.Category)
                .ToListAsync(); 
        }

        public async Task<PagedResult<Transaction>> GetPagedAsync(GetTransactionsQuery query)
        {
            var transactions = await _dbContext.Transactions
                .AsNoTracking()
                .Include(c => c.Category)
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            transactions = ApplyFilters(transactions, query);
            int totalItems = transactions.Count;

            transactions = transactions
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToList();

            return new PagedResult<Transaction>
            {
                Items = transactions,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize,
                TotalItems = totalItems
            };
        }

        public async Task<IReadOnlyList<Transaction>> GetAllAsync(GetTransactionsQuery query)
        {
            var transactions = await _dbContext.Transactions
                .AsNoTracking()
                .Include(c => c.Category)
                .ToListAsync();

            transactions = ApplyFilters(transactions, query);

            return transactions;
        }

        public Task<Transaction?> GetByAsync(Expression<Func<Transaction, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public async Task<Transaction> UpdateAsync(Transaction entity)
        {
            _dbContext.Transactions.Update(entity);     
            await _dbContext.SaveChangesAsync();

            return entity;        
        }

        private List<Transaction> ApplyFilters(List<Transaction> transactions, GetTransactionsQuery query)
        {
            if (query.CategoryId.HasValue)
            {
                transactions = transactions.Where(t => t.CategoryId == query.CategoryId.Value).ToList();
            }

            if (query.Day.HasValue)
            {
                transactions = transactions.Where(t => t.Date.Day == query.Day.Value).ToList();
            }

            if (query.Month.HasValue)
            {
                transactions = transactions.Where(t => t.Date.Month == query.Month.Value).ToList();
            }

            if (query.Year.HasValue)
            {
                transactions = transactions.Where(t => t.Date.Year == query.Year.Value).ToList();
            }

            return transactions;
        }
    }
}
