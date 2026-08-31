using System;
using System.Collections.Generic;
using System.Text;

namespace BudgetManager.Application.DTOs.Auth
{
    public record RegisterDto(string Email, string Password, string FirstName, string LastName);
}
