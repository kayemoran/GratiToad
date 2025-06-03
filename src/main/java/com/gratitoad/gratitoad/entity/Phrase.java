package com.gratitoad.gratitoad.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "phrase")
public class Phrase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Phrase cannot be blank")
    @Size(max = 500, message = "Phrase cannot be more than 500 characters")
    @Column(nullable = false, length = 500)
    private String phrase;

    @Min(value = -3, message = "Value must be at least -3")
    @Max(value = 3, message = "Value must be at most 3")
    @Column(nullable = false)
    private int value;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "FK_user_phrase"))
    private User user;

    // Konstruktorer
    public Phrase() {}

    public Phrase(String phrase, int value, User user) {
        this.phrase = phrase;
        this.value = value;
        this.user = user;
    }

    // Getters och setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPhrase() {
        return phrase;
    }

    public void setPhrase(String phrase) {
        this.phrase = phrase;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
