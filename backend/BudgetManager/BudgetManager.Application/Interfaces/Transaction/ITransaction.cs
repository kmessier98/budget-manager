using BudgetManager.Application.Common;
using BudgetManager.Application.Queries;
using BudgetManager.SharedLibrary.Interfaces;

namespace BudgetManager.Application.Interfaces.Transaction
{
    public interface ITransaction : IGenericInterface<Domain.Entities.Transaction>
    {
        Task<PagedResult<Domain.Entities.Transaction>> GetAllAsync(GetTransactionsQuery query);
    }
}
