namespace BudgetManager.Application.DTOs.Transaction
{
    public class TransactionDTO
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = null!;
        public decimal TotalAmount { get; set; } //todo revoir comment fairew.. ca va etre werid, la lsite aura des transactio net chauqe aura total amount
        public string Day { get; set; } = String.Empty; //todo revoir sera werid dna liste
        public string Month { get; set; } = null!; //todo rev oir sera weird dans lsite 
        public string Year { get; set; } = null!; //TODO revoir 
        public Dictionary<string, decimal> AmountByCategory { get; set; } = new Dictionary<string, decimal>(); //TODO revoir weird dans lsite 
        public CategoryDTO Category { get; set; } = null!;  
    }
}
