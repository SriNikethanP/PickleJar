# Admin User Setup Guide

## Option 1: Create Admin via Postman (Recommended)

### Step 1: Use the Registration Endpoint

**POST** `http://localhost:8080/api/v1/auth/register`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "fullName": "Admin User",
  "email": "admin@picklejar.com",
  "mobile": "1234567890",
  "password": "admin123",
  "confirmPassword": "admin123"
}
```

### Step 2: Update User Role to ADMIN

After registration, you need to manually update the user's role in the database:

**SQL Query:**

```sql
UPDATE users
SET role = 'ADMIN'
WHERE email = 'admin@picklejar.com';
```

## Option 2: Direct Database Insertion

### Step 1: Connect to MySQL Database

```bash
mysql -u root -p
USE pickle;
```

### Step 2: Insert Admin User

```sql
INSERT INTO users (full_name, email, mobile, password, role, banned, address)
VALUES (
    'Admin User',
    'admin@picklejar.com',
    '1234567890',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'ADMIN',
    false,
    '{"street": "Admin Street", "city": "Admin City", "state": "Admin State", "zipCode": "12345", "country": "Admin Country"}'
);
```

**Note:** The password hash above is for "admin123"

## Option 3: Create Admin Endpoint (Development Only)

You can create a temporary admin creation endpoint for development:

### Add this to your AuthController:

```java
@PostMapping("/create-admin")
public ResponseEntity<AuthResponseDTO> createAdmin(@RequestBody UserRegistrationDTO userRegistrationDTO) {
    AuthResponseDTO authResponse = userService.createAdmin(userRegistrationDTO);
    return ResponseEntity.ok(authResponse);
}
```

### Add this method to UserService:

```java
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
```

## Option 4: Remove Auto-Creation (Recommended for Production)

To prevent the admin from being created every time, remove the data.sql file or modify it:

### Remove the data.sql file:

```bash
rm src/main/resources/data.sql
```

### Or comment out the admin creation in data.sql:

```sql
-- Admin user creation (uncomment only for initial setup)
/*
INSERT INTO users (full_name, email, mobile, password, role, banned, address)
VALUES (
    'Admin User',
    'admin@picklejar.com',
    '1234567890',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'ADMIN',
    false,
    '{"street": "Admin Street", "city": "Admin City", "state": "Admin State", "zipCode": "12345", "country": "Admin Country"}'
) ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    mobile = VALUES(mobile),
    password = VALUES(password),
    role = VALUES(role),
    banned = VALUES(banned),
    address = VALUES(address);
*/
```

## Recommended Approach for Production

1. **Initial Setup**: Use Option 1 (Postman) to create the admin user
2. **Remove Auto-Creation**: Remove or comment out the data.sql admin creation
3. **Secure Credentials**: Change the default password after first login
4. **Backup**: Keep admin credentials in a secure location

## Admin Login Credentials

- **Email**: admin@picklejar.com
- **Password**: admin123
- **Login URL**: http://localhost:3000/admin/login
