package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.LoginRequestDTO;
import com.pickle_company.pickle.dto.OrderDTO;
import com.pickle_company.pickle.dto.UserRegistrationDTO;
import com.pickle_company.pickle.dto.UserResponseDTO;
import com.pickle_company.pickle.entity.Order;
import com.pickle_company.pickle.entity.Role;
import com.pickle_company.pickle.entity.User;
import com.pickle_company.pickle.mapper.OrderMapper;
import com.pickle_company.pickle.mapper.UserMapper;
import com.pickle_company.pickle.repository.OrderRepository;
import com.pickle_company.pickle.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    public UserService(  UserRepository userRepository,
                         UserMapper userMapper,
                         PasswordEncoder passwordEncoder,
                         OrderMapper orderMapper,
                         OrderRepository orderRepository){
        this.userMapper = userMapper;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.orderMapper= orderMapper;
        this.orderRepository = orderRepository;
    }

    public UserResponseDTO registerUser(UserRegistrationDTO userRegistrationDTO){
        if(userRepository.findByEmail(userRegistrationDTO.getEmail()).isPresent()){
            throw new IllegalArgumentException("Email already registered");
        }
        if(userRepository.findByMobile(userRegistrationDTO.getMobile()).isPresent()){
            throw new IllegalArgumentException("Mobile already registered");
        }
        if(!userRegistrationDTO.getPassword().equals(userRegistrationDTO.getConfirmPassword())){
            throw new IllegalArgumentException("Passwords do not match");
        }
        User user = userMapper.toEntity(userRegistrationDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.CUSTOMER);

        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }

    public UserResponseDTO loginUser(LoginRequestDTO loginRequestDTO){
        Optional<User> user =  userRepository.findByEmail(loginRequestDTO.getEmail());
        if(user.isEmpty()){
            throw new IllegalArgumentException("Invalid credentials");
        }
        if(!passwordEncoder.matches(loginRequestDTO.getPassword(),user.get().getPassword())){
            throw new IllegalArgumentException("Invalid credentials");
        }
        return userMapper.toDto(user.get());
    }
    public void setUserBannedStatus(Long userId, boolean banned) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setBanned(banned);
        userRepository.save(user);
    }

    public void resetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<OrderDTO> getUserOrders(Long userId) {
    List<Order> orders = orderRepository.findByUserId(userId);
    return orders.stream().map(orderMapper::toOrderDto).collect(Collectors.toList());
}

    public List<UserResponseDTO> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        return userMapper.toUserDtoList(allUsers);
    }
}
