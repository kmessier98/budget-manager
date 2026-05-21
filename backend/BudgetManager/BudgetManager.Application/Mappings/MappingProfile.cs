using AutoMapper;
using BudgetManager.Application.DTOs.Category;
using BudgetManager.Application.DTOs.Transaction;
using BudgetManager.Domain.Entities;

namespace BudgetManager.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<CreateTransactionDTO, Transaction>();
            CreateMap<UpdateTransactionDTO, Transaction>();
            CreateMap<TransactionDTO, Transaction>().ReverseMap();
            CreateMap<CategoryDTO, Category>().ReverseMap();
        }
    }
}
