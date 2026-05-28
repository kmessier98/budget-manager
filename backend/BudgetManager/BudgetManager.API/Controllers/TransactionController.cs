using BudgetManager.Application.DTOs.Transaction;
using BudgetManager.Application.Interfaces.Transaction;
using BudgetManager.Application.Queries;
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

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] GetTransactionsQuery query)
        {
            var result = await _transactionService.GetAll(query);

            return Ok(result);
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateTransactionDTO dto)
        {
            var result = await _transactionService.Update(dto);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _transactionService.Delete(id);

            return NoContent();
        }
    }
}
