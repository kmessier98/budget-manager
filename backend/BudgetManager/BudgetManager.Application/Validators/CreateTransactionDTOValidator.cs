using BudgetManager.Application.DTOs.Transaction;
using FluentValidation;

namespace BudgetManager.Application.Validators
{
    public class CreateTransactionDTOValidator : AbstractValidator<CreateTransactionDto>
    {
        public CreateTransactionDTOValidator() 
        {
            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than 0.");
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.");
        }
    }
}
