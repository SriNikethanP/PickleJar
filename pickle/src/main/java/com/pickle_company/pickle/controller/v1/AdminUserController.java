package com.pickle_company.pickle.controller.v1;

import com.pickle_company.pickle.dto.UserResponseDTO;
import com.pickle_company.pickle.dto.OrderDTO;
import com.pickle_company.pickle.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {
    private final UserService userService;
    public AdminUserController(UserService userService) { this.userService = userService; }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping(params = "userId")
    public ResponseEntity<UserResponseDTO> getUserById(@RequestParam Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PutMapping("/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long id, @RequestParam boolean banned) {
        userService.setUserBannedStatus(id, banned);
        return ResponseEntity.ok().build();
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
}

