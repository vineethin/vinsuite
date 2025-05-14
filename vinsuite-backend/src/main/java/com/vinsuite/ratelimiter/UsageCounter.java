package com.vinsuite.ratelimiter;

import java.time.LocalDate;

public class UsageCounter {
    private int count;
    private LocalDate date;

    public UsageCounter() {
        this.count = 0;
        this.date = LocalDate.now();
    }

    public int getCount() {
        return count;
    }

    public void increment() {
        if (!LocalDate.now().equals(this.date)) {
            this.count = 0;
            this.date = LocalDate.now();
        }
        this.count++;
    }

    public LocalDate getDate() {
        return date;
    }
}
