using AutoMapper;
using RealEstateAPI.DTOs;
using RealEstateAPI.Models;

namespace RealEstateAPI.Profiles;

/// <summary>
/// AutoMapper profile for User entity mappings
/// </summary>
public class UserProfile : Profile
{
    public UserProfile()
    {
        // Entity to ReadDto
        CreateMap<User, UserReadDto>();

        // CreateDto to Entity
        CreateMap<UserCreateDto, User>();

        // UpdateDto to Entity
        CreateMap<UserUpdateDto, User>();

        // Entity to UpdateDto (for PATCH operations)
        CreateMap<User, UserUpdateDto>();
    }
}
