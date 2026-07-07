using BudgetManager.Application.DTOs.User;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace BudgetManager.Application.Validators
{
    public class ChangePasswordDTOValidator : AbstractValidator<ChangePasswordDTO>
    {
        public ChangePasswordDTOValidator() 
        { 
            RuleFor(x => x.OldPassword)
                .NotEmpty().WithMessage("Old password is required.");
            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("New password is required.");
            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Confirm password is required.");
            RuleFor(x => x)
                .Must(x => x.OldPassword != x.NewPassword)
                .WithName("NewPassword").WithMessage("New password must be different from old password.");
            RuleFor(x => x)
                .Must(x => x.NewPassword == x.ConfirmPassword)
                .WithName("PasswordConfirmation").WithMessage("New password and confirm password must match.");
        }
    }
}
