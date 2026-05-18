using AutoMapper;
using BudgetManager.Application.DTOs.Transaction;
using BudgetManager.Domain.Entities;

namespace BudgetManager.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<CreateTransactionDto, Transaction>();
            CreateMap<TransactionDTO, Transaction>().ReverseMap();
            CreateMap<CategoryDTO, Category>().ReverseMap();
        }
    }
}
