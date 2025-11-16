using AutoMapper;
using RealEstateAPI.DTOs;
using RealEstateAPI.Models;

namespace RealEstateAPI.Profiles;

/// <summary>
/// AutoMapper profile for Property entity mappings
/// </summary>
public class PropertyProfile : Profile
{
    public PropertyProfile()
    {
        // Entity to ReadDto
        CreateMap<Property, PropertyReadDto>();

        // CreateDto to Entity
        CreateMap<PropertyCreateDto, Property>();

        // UpdateDto to Entity
        CreateMap<PropertyUpdateDto, Property>();

        // Entity to UpdateDto (for PATCH operations)
        CreateMap<Property, PropertyUpdateDto>();
    }
}
