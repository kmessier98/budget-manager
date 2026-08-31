namespace BudgetManager.Domain.Exceptions
{
    public class NotFoundException : ApplicationException
    {
        public NotFoundException(string message) : base(message, 404) { }
    }
}
