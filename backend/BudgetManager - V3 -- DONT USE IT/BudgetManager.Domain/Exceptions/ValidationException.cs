namespace BudgetManager.Domain.Exceptions
{
    public class ValidationException : Exception
    {
        // Stocke les erreurs sous forme : "NomDuChamp" -> ["Erreur 1", "Erreur 2"]
        public IDictionary<string, string[]> Errors { get; }
        public ValidationException(IDictionary<string, string[]> errors)
             : base("Une ou plusieurs validations ont échoué.")
        {
            Errors = errors;
        }

    }
}
