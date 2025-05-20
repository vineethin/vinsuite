package com.vinsuite.ratelimiter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private final Map<String, UsageCounter> usageMap = new ConcurrentHashMap<>();

    @Value("${rate.limit.writer:20}")
    private int writerLimit;

    @Value("${rate.limit.qa:30}")
    private int qaLimit;

    @Value("${rate.limit.dev:25}")
    private int devLimit;

    @Value("${rate.limit.ba:20}")
    private int baLimit;

    @Value("${rate.limit.support:15}")
    private int supportLimit;

    /**
     * Check if the user is still allowed based on current usage and role limit.
     */
    public boolean isAllowed(String userId, String role) {
        String key = userId + ":" + role;
        UsageCounter counter = usageMap.getOrDefault(key, new UsageCounter());
        int limit = getLimitForRole(role);
        return counter.getCount() < limit;
    }

    /**
     * Increment usage count for the given user and role.
     */
    public void consumeQuota(String userId, String role) {
        String key = userId + ":" + role;
        UsageCounter counter = usageMap.computeIfAbsent(key, k -> new UsageCounter());
        counter.increment(); // ✅ Now we only increment here
    }

    /**
     * Return the remaining quota for the given user and role.
     */
    public int getRemainingQuota(String userId, String role) {
        String key = userId + ":" + role;
        UsageCounter counter = usageMap.get(key);
        int limit = getLimitForRole(role);
        return counter == null ? limit : Math.max(0, limit - counter.getCount());
    }

    /**
     * Fetch the quota limit for a given role.
     */
    private int getLimitForRole(String role) {
        return switch (role.toLowerCase()) {
            case "writer" -> writerLimit;
            case "qa" -> qaLimit;
            case "dev" -> devLimit;
            case "ba" -> baLimit;
            case "support" -> supportLimit;
            default -> 10; // fallback default
        };
    }
}
