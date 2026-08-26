using BudgetManager.Application.Common;

namespace BudgetManager.Application.DTOs.Transaction
{
    public class TransactionResponseDTO
    {
        public IReadOnlyList<TransactionDTO> Transactions { get; }
        public PaginationMetada Metadata { get;  }
        public TransactionSummaryDTO Summary { get; }
        public TransactionResponseDTO(IReadOnlyList<TransactionDTO> transactions, PaginationMetada metadata, TransactionSummaryDTO summary)
        {
            Transactions = transactions;
            Metadata = metadata;
            Summary = summary;
        }
    }
}
