using BudgetManager.Application.DTOs.Transaction;

namespace BudgetManager.Application.Interfaces.Transaction
{
    public interface ITransactionService
    {
        Task<TransactionDTO> GetById(Guid id);
        Task<TransactionDTO> Create(CreateTransactionDTO dto);
        Task<TransactionDTO> Update(UpdateTransactionDTO dto);
    }
}
