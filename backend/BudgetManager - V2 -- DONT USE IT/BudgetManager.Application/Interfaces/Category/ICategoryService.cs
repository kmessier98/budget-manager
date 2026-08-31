using BudgetManager.Application.DTOs.Category;

namespace BudgetManager.Application.Interfaces.Category
{
    public interface ICategoryService
    {
        Task<IReadOnlyList<CategoryDTO>> GetAll();
    }
}
