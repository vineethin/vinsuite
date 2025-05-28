package com.vinsuite.service;

import com.vinsuite.model.User;
import com.vinsuite.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // ✅ Fetch users from a specific company
    public List<User> getUsersByTenantId(UUID tenantId) {
        return userRepository.findByTenantId(tenantId);
    }
}
