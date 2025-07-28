package com.pickle_company.pickle.service;

import com.pickle_company.pickle.dto.AuthResponseDTO;
import com.pickle_company.pickle.dto.LoginRequestDTO;
import com.pickle_company.pickle.dto.OrderDTO;
import com.pickle_company.pickle.dto.RefreshTokenRequestDTO;
import com.pickle_company.pickle.dto.UserRegistrationDTO;
import com.pickle_company.pickle.dto.UserResponseDTO;
import com.pickle_company.pickle.entity.Order;
import com.pickle_company.pickle.entity.Role;
import com.pickle_company.pickle.entity.User;
import com.pickle_company.pickle.mapper.OrderMapper;
import com.pickle_company.pickle.mapper.UserMapper;
import com.pickle_company.pickle.repository.OrderRepository;
import com.pickle_company.pickle.repository.UserRepository;
import com.pickle_company.pickle.util.JwtUtil;
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
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       UserMapper userMapper,
                       PasswordEncoder passwordEncoder,
                       OrderMapper orderMapper,
                       OrderRepository orderRepository,
                       JwtUtil jwtUtil){
        this.userMapper = userMapper;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.orderMapper= orderMapper;
        this.orderRepository = orderRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponseDTO registerUser(UserRegistrationDTO userRegistrationDTO){
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
        
        String accessToken = jwtUtil.generateToken(saved.getEmail(), saved.getId(), saved.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(saved.getEmail());
        
        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(86400000L) // 24 hours
                .user(userMapper.toDto(saved))
                .build();
    }

    public AuthResponseDTO loginUser(LoginRequestDTO loginRequestDTO){
        Optional<User> user =  userRepository.findByEmail(loginRequestDTO.getEmail());
        if(user.isEmpty()){
            throw new IllegalArgumentException("Invalid credentials");
        }
        if(!passwordEncoder.matches(loginRequestDTO.getPassword(),user.get().getPassword())){
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        User userEntity = user.get();
        String accessToken = jwtUtil.generateToken(userEntity.getEmail(), userEntity.getId(), userEntity.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(userEntity.getEmail());
        
        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(86400000L) // 24 hours
                .user(userMapper.toDto(userEntity))
                .build();
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

    public UserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return userMapper.toDto(user);
    }

    public AuthResponseDTO refreshToken(RefreshTokenRequestDTO refreshTokenRequest) {
        try {
            String email = jwtUtil.extractEmail(refreshTokenRequest.getRefreshToken());
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            if (user.isBanned()) {
                throw new IllegalArgumentException("User is banned");
            }
            
            String newAccessToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());
            String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail());
            
            return AuthResponseDTO.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .expiresIn(86400000L) // 24 hours
                    .user(userMapper.toDto(user))
                    .build();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
    }

    public AuthResponseDTO createAdmin(UserRegistrationDTO userRegistrationDTO) {
        if(userRepository.findByEmail(userRegistrationDTO.getEmail()).isPresent()){
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setFullName(userRegistrationDTO.getFullName());
        user.setEmail(userRegistrationDTO.getEmail());
        user.setMobile(userRegistrationDTO.getMobile());
        user.setPassword(passwordEncoder.encode(userRegistrationDTO.getPassword()));
        user.setRole(Role.ADMIN); // Set role to ADMIN
        user.setBanned(false);

        User saved = userRepository.save(user);
        
        String accessToken = jwtUtil.generateToken(saved.getEmail(), saved.getId(), saved.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(saved.getEmail());
        
        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(86400000L)
                .user(userMapper.toDto(saved))
                .build();
    }
}
