using BudgetManager.API.Extensions;
using BudgetManager.Application.DTOs.Transaction;
using BudgetManager.Application.Interfaces.Transaction;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace BudgetManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly IValidator<CreateTransactionDto> _createTransactionValidator;
        private readonly ITransactionService _transactionService;

        public TransactionController(IValidator<CreateTransactionDto> createTransactionValidator, ITransactionService transactionService)
        {
            _createTransactionValidator = createTransactionValidator;
            _transactionService = transactionService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTransactionDto dto)
        {
            var validationResult = await _createTransactionValidator.ValidateAsync(dto);
            if (!validationResult.IsValid) 
            { 
                validationResult.AddToModelState(ModelState);
                return UnprocessableEntity(ModelState);
            }

            var result = await _transactionService.Create(dto);
       
            return Ok(result);
        }
    }
}
