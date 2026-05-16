namespace BudgetManager.API.Middlewares
{
    using BudgetManager.Domain.Exceptions;
    using Microsoft.AspNetCore.Diagnostics;
    using Microsoft.AspNetCore.Mvc;

    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "Une erreur inattendue est survenue : {Message}", exception.Message);

            // 1. Cas spécifique : Erreur de validation FluentValidation
            if (exception is ValidationException validationEx)
            {
                var validationProblemDetails = new HttpValidationProblemDetails(validationEx.Errors)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Erreur de validation",
                    Detail = "Un ou plusieurs champs ne respectent pas les règles métier.",
                    Instance = httpContext.Request.Path
                };

                httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                await httpContext.Response.WriteAsJsonAsync(validationProblemDetails, cancellationToken);

                return true; // L'exception est gérée
            }

            // 2. Autres cas : Exceptions classiques de l'application
            var (statusCode, title) = exception switch
            {
                NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
                _ => (StatusCodes.Status500InternalServerError, "Une erreur est survenue sur le serveur.")
            };

            var problemDetails = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Instance = httpContext.Request.Path
            };

            httpContext.Response.StatusCode = statusCode;

            // .NET génère automatiquement le format RFC 7807 (Problem Details) 
            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

            return true; // Indique que l'exception a été gérée et ne doit pas propager plus loin 
        }
    }
}
