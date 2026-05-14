using BudgetManager.Application.Interfaces;
using BudgetManager.Domain.Entities;
using BudgetManager.Infrastructure.Data;
using BudgetManager.SharedLibrary.Responses;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace BudgetManager.Infrastructure.Repositories
{
    public class TransactionRepository : ITransaction
    {
        private readonly AppDbContext _dbContext;

        public TransactionRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public Task<Response> CreateAsync(Transaction entity)
        {
            throw new NotImplementedException();
        }

        public Task<Response> DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<Transaction> FindByIdAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Transaction>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Transaction> GetByAsync(Expression<Func<Transaction, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<Response> UpdateAsync(Transaction entity)
        {
            throw new NotImplementedException();
        }
    }
}
