package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.UserRegistrationDTO;
import com.pickle_company.pickle.dto.UserResponseDTO;
import com.pickle_company.pickle.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserRegistrationDTO registrationDTO);
    UserResponseDTO toDto(User user);
    List<UserResponseDTO> toUserDtoList(List<User> allUsers);
}
