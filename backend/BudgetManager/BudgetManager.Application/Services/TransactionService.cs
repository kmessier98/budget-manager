using AutoMapper;
using BudgetManager.Application.DTOs.Transaction;
using BudgetManager.Application.Interfaces;
using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Domain.Entities;
using BudgetManager.Domain.Exceptions;

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

        public async Task<TransactionDTO> GetById(Guid id)
        {
            var entity = await _transactionRepository.FindByIdAsync(id);
            if (entity == null)
            {
                throw new NotFoundException("Transaction not found");
            }

            return _mapper.Map<TransactionDTO>(entity);
        }

        public async Task<TransactionDTO> Create(CreateTransactionDTO dto)
        {
            var category = await _categoryRepository.FindByIdAsync(dto.CategoryId);
            if (category == null)
            {
                throw new NotFoundException("Category not found"); 
            }

            var entity = _mapper.Map<Transaction>(dto);
            var createdEntity = await _transactionRepository.CreateAsync(entity);
            return _mapper.Map<TransactionDTO>(createdEntity);
        }

        public async Task<TransactionDTO> Update(UpdateTransactionDTO dto)
        {
            var existingEntity = await _transactionRepository.FindByIdAsync(dto.Id);
            if (existingEntity == null)
            {
                throw new NotFoundException("Transaction not found");
            }

            var category = await _categoryRepository.FindByIdAsync(dto.CategoryId);
            if (category == null)
            {
                throw new NotFoundException("Category not found");
            }

            var entity = _mapper.Map<Transaction>(dto);
            var updatedEntity = await _transactionRepository.UpdateAsync(entity);

            return _mapper.Map<TransactionDTO>(updatedEntity);
        }
    }
}
