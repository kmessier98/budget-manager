using AutoMapper;
using BudgetManager.Application.DTOs.Transaction;
using BudgetManager.Domain.Entities;

namespace BudgetManager.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<TransactionDTO, Transaction>().ReverseMap();
        }
    }
}
