package com.ulpin.spring_registry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ParcelRequestDTO {

    @NotBlank(message = "Parcel number is required")
    private String parcelNumber;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be greater than 0")
    private Double area;

    @NotBlank(message = "Land type is required")
    private String landType;

    private GeometryDTO geometry;


    // Get Parcel Number
    public String getParcelNumber() {
        return parcelNumber;
    }

    public void setParcelNumber(String parcelNumber) {
        this.parcelNumber = parcelNumber;
    }


    // Get Address
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    // Get District
    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }


    // Get State
    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }


    // Get Area
    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }


    // Get Land Type
    public String getLandType() {
        return landType;
    }

    public void setLandType(String landType) {
        this.landType = landType;
    }


    // Get Geometry
    public GeometryDTO getGeometry() {
        return geometry;
    }

    public void setGeometry(GeometryDTO geometry) {
        this.geometry = geometry;
    }
}