package com.pickle_company.pickle.mapper;

import com.pickle_company.pickle.dto.UserRegistrationDTO;
import com.pickle_company.pickle.dto.UserResponseDTO;
import com.pickle_company.pickle.dto.AddressDTO;
import com.pickle_company.pickle.entity.User;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {
    
    public User toEntity(UserRegistrationDTO registrationDTO) {
        if (registrationDTO == null) {
            return null;
        }
        
        return User.builder()
                .fullName(registrationDTO.getFullName())
                .email(registrationDTO.getEmail())
                .mobile(registrationDTO.getMobile())
                .password(registrationDTO.getPassword())
                .build();
    }
    
    public UserResponseDTO toDto(User user) {
        if (user == null) {
            return null;
        }
        
        AddressDTO addressDTO = null;
        if (user.getAddress() != null) {
            addressDTO = AddressDTO.builder()
                    .street(user.getAddress().getStreet())
                    .city(user.getAddress().getCity())
                    .state(user.getAddress().getState())
                    .pincode(user.getAddress().getPincode())
                    .build();
        }
        
        return UserResponseDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .address(addressDTO)
                .build();
    }
    
    public List<UserResponseDTO> toUserDtoList(List<User> allUsers) {
        if (allUsers == null) {
            return null;
        }
        
        return allUsers.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
