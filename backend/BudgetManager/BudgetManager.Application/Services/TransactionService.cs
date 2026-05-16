using AutoMapper;
using BudgetManager.Application.DTOs.Transaction;
using BudgetManager.Application.Interfaces;
using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Domain.Entities;

namespace BudgetManager.Application.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IMapper _mapper;
        private readonly ITransaction _transactionRepository;
        private readonly ICategory _categoryRepository;

        public TransactionService(IMapper mapper, ITransaction transactionRepository, ICategory categoryRepository)
        {
            _mapper = mapper;
            _transactionRepository = transactionRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<TransactionDTO> Create(CreateTransactionDto dto)
        {
            var category = await _categoryRepository.FindByIdAsync(dto.CategoryId);
            if (category == null)
            {
                throw new Exception("Category not found"); //todo custom exception ?
            }

            var entity = _mapper.Map<Transaction>(dto);
            var createdEntity = await _transactionRepository.CreateAsync(entity);
            return _mapper.Map<TransactionDTO>(createdEntity);
        }
    }
}
