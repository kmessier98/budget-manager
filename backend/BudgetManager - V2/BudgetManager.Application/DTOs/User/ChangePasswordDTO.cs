using System;
using System.Collections.Generic;
using System.Text;

namespace BudgetManager.Application.DTOs.User
{
    public record ChangePasswordDTO(string OldPassword, string NewPassword, string ConfirmPassword);
}
