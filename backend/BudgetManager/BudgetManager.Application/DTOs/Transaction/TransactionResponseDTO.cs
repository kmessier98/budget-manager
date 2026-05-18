namespace BudgetManager.Application.DTOs.Transaction
{
    public class TransactionResponseDTO
    {
        public IReadOnlyList<TransactionDTO> Transactions { get; }
        public TransactionSummaryDTO Summary { get; }
        public TransactionResponseDTO(IReadOnlyList<TransactionDTO> transactions, TransactionSummaryDTO summary)
        {
            Transactions = transactions;
            Summary = summary;
        }
    }
}
