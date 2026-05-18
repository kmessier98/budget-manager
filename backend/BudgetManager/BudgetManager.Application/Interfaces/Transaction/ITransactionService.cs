using BudgetManager.Application.DTOs.Transaction;
using BudgetManager.Application.Queries;

namespace BudgetManager.Application.Interfaces.Transaction
{
    public interface ITransactionService
    {
        Task<TransactionResponseDTO> GetAll(GetTransactionsQuery query);
        Task<TransactionDTO> GetById(Guid id);
        Task<TransactionDTO> Create(CreateTransactionDTO dto);
        Task<TransactionDTO> Update(UpdateTransactionDTO dto);
        Task Delete(Guid id);
    }
}
