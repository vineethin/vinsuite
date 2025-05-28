package com.vinsuite.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

/**
 * Data Transfer Object for exposing user information in API responses
 * and capturing user creation data via admin tools.
 */
public class UserDTO {

    @JsonProperty("id")
    private UUID id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("email")
    private String email;

    @JsonProperty("role")
    private String role;

    @JsonProperty("department")
    private String department;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // ✅ Only available for input, not in responses
    private String password;

    // Default constructor
    public UserDTO() {}

    // All-args constructor (excluding password for safety in responses)
    public UserDTO(UUID id, String name, String email, String role, String department) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
    }

    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getDepartment() { return department; }
    public String getPassword() { return password; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
    public void setDepartment(String department) { this.department = department; }
    public void setPassword(String password) { this.password = password; }
}
