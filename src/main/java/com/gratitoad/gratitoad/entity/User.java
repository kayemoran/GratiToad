package com.gratitoad.gratitoad.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "user")
    private String user;

    // Constructors
    public User() {}

    public User(String user) {
        this.user = user;
    }

    // Getters and Setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }
}
