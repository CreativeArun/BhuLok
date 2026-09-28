package com.ulpin.spring_registry.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;


    // =========================================================
    // GETTER AND SETTER FOR ID
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // =========================================================
    // GETTER AND SETTER FOR NAME
    // =========================================================

    public String getName() {
        return name;
    }

    public void setName(
            String name) {

        this.name = name;
    }


    // =========================================================
    // GETTER AND SETTER FOR EMAIL
    // =========================================================

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
    }


    // =========================================================
    // GETTER AND SETTER FOR PHONE
    // =========================================================

    public String getPhone() {
        return phone;
    }

    public void setPhone(
            String phone) {

        this.phone = phone;
    }


    // =========================================================
    // GETTER AND SETTER FOR ADDRESS
    // =========================================================

    public String getAddress() {
        return address;
    }

    public void setAddress(
            String address) {

        this.address = address;
    }
}