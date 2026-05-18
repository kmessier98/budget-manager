namespace BudgetManager.Application.DTOs.Transaction
{
    public class TransactionSummaryDTO
    {
        public decimal TotalAmount { get; set; }
        public decimal TodayTotal { get; set; }
        public decimal MonthTotal { get; set; }
        public decimal YearTotal { get; set; }

        public Dictionary<string, decimal> AmountByCategory { get; set; } = new Dictionary<string, decimal>();
    }
}
