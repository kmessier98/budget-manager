namespace BudgetManager.Application.Queries
{
    public class GetTransactionsQuery : PaginationQuery
    {
        public Guid? CategoryId {  get; set; }
        public int? Day { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
    }
}
