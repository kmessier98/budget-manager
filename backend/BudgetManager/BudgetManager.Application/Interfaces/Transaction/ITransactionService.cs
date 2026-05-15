using BudgetManager.Application.DTOs.Transaction;

namespace BudgetManager.Application.Interfaces.Transaction
{
    public interface ITransactionService
    {
        Task<TransactionDTO> Create(CreateTransactionDto dto);
    }
}
