using BudgetManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BudgetManager.Infrastructure.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Transaction>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(b => b.CategoryId)
                .OnDelete(DeleteBehavior.Restrict); // BLOQUE la suppression de la catégorie

            modelBuilder.Entity<Transaction>()
                .Property(c => c.Amount)
                .HasColumnType("decimal(18,2)");

        }
    }
}
