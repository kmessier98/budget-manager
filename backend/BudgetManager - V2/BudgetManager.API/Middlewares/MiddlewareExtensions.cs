namespace BudgetManager.API.Middlewares
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseRefreshToken(this IApplicationBuilder app)
        {
            return app.UseMiddleware<RefreshTokenMiddleware>();
        }
    }
}
