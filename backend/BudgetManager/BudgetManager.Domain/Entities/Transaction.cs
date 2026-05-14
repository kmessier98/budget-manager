namespace BudgetManager.Domain.Entities
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = null!;
        public Guid CategoryId { get; set; }
    }
}
