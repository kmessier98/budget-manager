using AutoMapper;
using BudgetManager.Application.DTOs.Category;
using BudgetManager.Application.Interfaces.Category;

namespace BudgetManager.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IMapper _mapper;
        private readonly ICategory _categoryRepository;

        public CategoryService(IMapper mapper, ICategory categoryRepository)
        {
            _mapper = mapper;
            _categoryRepository = categoryRepository;
        }
        public async Task<IReadOnlyList<CategoryDTO>> GetAll()
        {
            var categories = await _categoryRepository.GetAllAsync();
            var categoryDTOs = _mapper.Map<IReadOnlyList<CategoryDTO>>(categories);

            return categoryDTOs;
        }
    }
}
