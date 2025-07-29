package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.UserResponseDTO;
import com.pickle_company.pickle.dto.OrderDTO;
import com.pickle_company.pickle.dto.UserUpdateDTO;
import com.pickle_company.pickle.dto.AddressDTO;
import com.pickle_company.pickle.service.UserService;
import com.pickle_company.pickle.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/users")
public class UserController {
 private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

     @GetMapping(params = "userId")
    public ResponseEntity<UserResponseDTO> getUserById(@RequestParam Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        userService.resetPassword(id, body.get("newPassword"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/orders")
    public List<OrderDTO> getUserOrders(@PathVariable Long id) {
        return userService.getUserOrders(id);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser() {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        UserResponseDTO userDTO = userService.getUserById(userId);
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateCurrentUser(@RequestBody UserUpdateDTO updateDTO) {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        UserResponseDTO updatedUser = userService.updateUser(userId, updateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/me/address")
    public ResponseEntity<UserResponseDTO> updateCurrentUserAddress(@RequestBody AddressDTO addressDTO) {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        UserResponseDTO updatedUser = userService.updateUserAddress(userId, addressDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/me/orders")
    public ResponseEntity<List<OrderDTO>> getCurrentUserOrders() {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        List<OrderDTO> orders = userService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
}
