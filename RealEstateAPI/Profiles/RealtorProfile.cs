using AutoMapper;
using RealEstateAPI.DTOs;
using RealEstateAPI.Models;

namespace RealEstateAPI.Profiles;

/// <summary>
/// AutoMapper profile for Realtor entity mappings
/// </summary>
public class RealtorProfile : Profile
{
    public RealtorProfile()
    {
        // Entity to ReadDto
        CreateMap<Realtor, RealtorReadDto>();

        // CreateDto to Entity
        CreateMap<RealtorCreateDto, Realtor>();

        // UpdateDto to Entity
        CreateMap<RealtorUpdateDto, Realtor>();

        // Entity to UpdateDto (for PATCH operations)
        CreateMap<Realtor, RealtorUpdateDto>();
    }
}
