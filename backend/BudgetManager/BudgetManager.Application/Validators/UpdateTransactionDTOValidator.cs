using BudgetManager.Application.DTOs.Transaction;
using FluentValidation;

namespace BudgetManager.Application.Validators
{
    public class UpdateTransactionDTOValidator : AbstractValidator<UpdateTransactionDTO>
    {
        public UpdateTransactionDTOValidator()
        {
            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than 0.");
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.");
        }
    }
}
