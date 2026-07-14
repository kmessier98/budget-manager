namespace BudgetManager.Application.DTOs.Transaction
{
    public class UpdateTransactionDTO
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public string Description { get; set; } = null!;
        public Guid CategoryId { get; set; }
    }
}
