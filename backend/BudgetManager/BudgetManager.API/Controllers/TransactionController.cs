using BudgetManager.Application.DTOs.Transaction;
using BudgetManager.Application.Interfaces.Transaction;
using Microsoft.AspNetCore.Mvc;

namespace BudgetManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _transactionService.GetById(id);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTransactionDTO dto)
        {
            var result = await _transactionService.Create(dto);

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(UpdateTransactionDTO dto)
        {
            var result = await _transactionService.Update(dto);

            return Ok(result);
        }
    }
}
