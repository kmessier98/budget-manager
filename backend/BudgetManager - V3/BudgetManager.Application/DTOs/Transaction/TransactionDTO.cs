using BudgetManager.Application.DTOs.Category;

namespace BudgetManager.Application.DTOs.Transaction
{
    public class TransactionDTO
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; } = null!;
 
        public CategoryDTO Category { get; set; } = null!;  
    }
}
