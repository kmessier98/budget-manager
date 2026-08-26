using System;
using System.Collections.Generic;
using System.Text;

namespace BudgetManager.SharedLibrary.Responses
{
    public record Response(bool Flag = false, string Message = null!);
}
