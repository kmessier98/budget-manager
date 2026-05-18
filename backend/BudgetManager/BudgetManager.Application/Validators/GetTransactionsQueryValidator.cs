using BudgetManager.Application.Queries;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BudgetManager.Application.Validators
{
    public class GetTransactionsQueryValidator : AbstractValidator<GetTransactionsQuery>
    {
        public GetTransactionsQueryValidator() 
        { 
            RuleFor(x => x.PageNumber)
                .GreaterThan(0).WithMessage("Page number must be greater than 0.");
            RuleFor(x => x.PageSize)
                .GreaterThan(0).WithMessage("Page size must be greater than 0.")
                .LessThanOrEqualTo(50).WithMessage("Page size must be less than or equal to 50.");

        }
    }
}
