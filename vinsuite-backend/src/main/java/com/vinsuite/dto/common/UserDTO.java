package com.vinsuite.dto.common;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String department;

    public UserDTO(Long id, String name, String email, String role, String department) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getDepartment() { return department; }
}
