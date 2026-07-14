namespace BudgetManager.API.Filters
{
    using FluentValidation;
    using Microsoft.AspNetCore.Mvc.Filters;

    namespace BudgetManager.API.Filters
    {
        public class ValidationFilter : IAsyncActionFilter

        {
            private readonly IServiceProvider _serviceProvider;

            public ValidationFilter(IServiceProvider serviceProvider)
            {
                _serviceProvider = serviceProvider;
            }

            public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)

            {
                // 1. Parcourir les arguments de la méthode du contrôleur pour trouver un DTO à valider 
                foreach (var argument in context.ActionArguments.Values)
                {
                    if (argument == null) continue;

                    // Chercher dynamiquement si un IValidator<TypeDuDto> est enregistré dans le conteneur DI 
                    var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());
                    var validator = _serviceProvider.GetService(validatorType) as IValidator;

                    if (validator != null)
                    {
                        // 2. Exécuter la validation de manière asynchrone et moderne 
                        var validationContext = new ValidationContext<object>(argument);
                        var validationResult = await validator.ValidateAsync(validationContext);

                        if (!validationResult.IsValid)
                        {
                            // Transforme les erreurs en dictionnaire pour notre exception du Domain 
                            var errors = validationResult.Errors
                                .GroupBy(e => e.PropertyName)
                                .ToDictionary(
                                    g => g.Key,
                                    g => g.Select(e => e.ErrorMessage).ToArray()
                                );

                            // On lève l'exception : elle sera capturée par le GlobalExceptionHandler ! 
                            throw new global::BudgetManager.Domain.Exceptions.ValidationException(errors);
                        }
                    }

                }

                await next(); // Si tout est valide, on continue vers le contrôleur 
            }

        }

    }

}
