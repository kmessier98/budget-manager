using BudgetManager.SharedLibrary.Responses;
using System.Linq.Expressions;

namespace BudgetManager.SharedLibrary.Interfaces
{
    public interface IGenericInterface<T> where T : class
    {
        Task<T> CreateAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> FindByIdAsync(Guid id);
        Task<T?> GetByAsync(Expression<Func<T, bool>> predicate);
    }
}
