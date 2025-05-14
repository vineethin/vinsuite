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

    public boolean isAllowed(String userId, String role) {
        String key = userId + ":" + role;
        UsageCounter counter = usageMap.computeIfAbsent(key, k -> new UsageCounter());
        counter.increment();

        int limit = getLimitForRole(role);
        return counter.getCount() <= limit;
    }

    public int getRemainingQuota(String userId, String role) {
        String key = userId + ":" + role;
        UsageCounter counter = usageMap.get(key);
        int limit = getLimitForRole(role);
        return counter == null ? limit : Math.max(0, limit - counter.getCount());
    }

    private int getLimitForRole(String role) {
        return switch (role.toLowerCase()) {
            case "writer" -> writerLimit;
            case "qa" -> qaLimit;
            case "dev" -> devLimit;
            case "ba" -> baLimit;
            case "support" -> supportLimit;
            default -> 10; // fallback limit
        };
    }
}
