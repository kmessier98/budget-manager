namespace BudgetManager.API.Configurations
{
    using Microsoft.AspNetCore.OpenApi;
    using Microsoft.OpenApi;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    public class BearerSecuritySchemeTransformer : IOpenApiDocumentTransformer
    {
        public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
        {
            // 1. Initialisation sécurisée des dictionnaires de composants (.NET 10)
            document.Components ??= new OpenApiComponents();
            document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();

            // 2. Définition du schéma de sécurité Bearer JWT
            var scheme = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "Collez votre jeton JWT brut ici (sans écrire 'Bearer')."
            };

            // Enregistrement du schéma dans les composants globaux
            var referenceId = "Bearer";
            document.Components.SecuritySchemes[referenceId] = scheme;

            // 3. Application globale de la sécurité avec les types natifs de .NET 10
            document.Security ??= new List<OpenApiSecurityRequirement>();

            // Utilisation de la nouvelle classe de référence .NET 10 liée au document
            var schemeReference = new OpenApiSecuritySchemeReference(referenceId, document);

            var securityRequirement = new OpenApiSecurityRequirement
            {
                [schemeReference] = new List<string>()
            };

            document.Security.Add(securityRequirement);

            return Task.CompletedTask;
        }
    }
}
