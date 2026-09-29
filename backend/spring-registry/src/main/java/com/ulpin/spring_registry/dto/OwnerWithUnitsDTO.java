package com.ulpin.spring_registry.dto;

import java.util.List;

public class OwnerWithUnitsDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;

    private List<UnitDTO> units;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<UnitDTO> getUnits() {
        return units;
    }

    public void setUnits(List<UnitDTO> units) {
        this.units = units;
    }
}
