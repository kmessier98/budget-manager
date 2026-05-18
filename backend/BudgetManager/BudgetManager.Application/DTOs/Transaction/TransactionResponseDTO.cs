namespace BudgetManager.Application.DTOs.Transaction
{
    public class TransactionResponseDTO
    {
        public TransactionDTO Transaction { get; }
        public TransactionSummaryDTO Summary { get; }
        public TransactionResponseDTO(TransactionDTO transaction, TransactionSummaryDTO summary)
        {
            Transaction = transaction;
            Summary = summary;
        }
    }
}
