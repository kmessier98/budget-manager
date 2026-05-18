using AutoMapper;
using BudgetManager.Application.Common;
using BudgetManager.Application.DTOs.Category;
using BudgetManager.Application.DTOs.Transaction;
using BudgetManager.Application.Interfaces;
using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Application.Queries;
using BudgetManager.Domain.Entities;
using BudgetManager.Domain.Exceptions;
using System.Reflection.Metadata.Ecma335;

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


        public async Task<TransactionResponseDTO> GetAll(GetTransactionsQuery query)
        {
            var pagedResult = await _transactionRepository.GetPagedAsync(query);
            var transactionDTOs = _mapper.Map<IReadOnlyList<TransactionDTO>>(pagedResult.Items);  
            var metadata = new PaginationMetada
            {
                PageNumber = pagedResult.PageNumber,
                PageSize = pagedResult.PageSize,
                TotalItems = pagedResult.TotalItems,
            };
            var summary = await GetTransactionsSummaryDTO(query);

            return new TransactionResponseDTO(transactionDTOs, metadata, summary);
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

        public async Task Delete(Guid id)
        {
            bool isDeleted = await _transactionRepository.DeleteAsync(id);
            if (!isDeleted)
            {
                throw new NotFoundException("Transaction not found");
            }
        }

        private async Task<TransactionSummaryDTO> GetTransactionsSummaryDTO(GetTransactionsQuery query)
        {
            var transactions = await _transactionRepository.GetAllAsync(query);

            var transactionDTOs = _mapper.Map<IReadOnlyList<TransactionDTO>>(transactions);
            var totalAmount = transactionDTOs.Sum(t => t.Amount);
            var categoryDTO = query.CategoryId.HasValue ? transactionDTOs.FirstOrDefault(t => t.Category.Id == query.CategoryId)?.Category : null;
            var amountByCategory = transactionDTOs
                .GroupBy(t => t.Category.Id)
                .Select(g => new CategoryAmountDTO
                {
                    Id = g.Key,
                    Name = g.First().Category.Name,
                    Amount = g.Sum(t => t.Amount)
                })
                .ToList();

            return new TransactionSummaryDTO
            {
                TotalAmount = totalAmount,
                Day = query.Day,
                Month = query.Month,
                Year = query.Year,
                Category = categoryDTO,
                AmountByCategory = amountByCategory
            };
        }
    }
}
