using BudgetManager.Application.DTOs.Category;

namespace BudgetManager.Application.DTOs.Transaction
{
    public class TransactionSummaryDTO
    {
        public decimal TotalAmount { get; set; }
        public int? Day { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
        public CategoryDTO? Category { get; set; }

        public List<CategoryAmountDTO> AmountByCategory { get; set; } = new List<CategoryAmountDTO>();
    }
}
