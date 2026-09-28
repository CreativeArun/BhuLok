package com.ulpin.spring_registry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BuildingRequestDTO {

    @NotBlank(message = "Building number is required")
    private String buildingNumber;

    @NotBlank(message = "Building name is required")
    private String name;

    @NotBlank(message = "Building type is required")
    private String buildingType;

    @NotNull(message = "Number of floors is required")
    @Positive(message = "Number of floors must be greater than 0")
    private Integer numberOfFloors;

    @NotNull(message = "Parcel ID is required")
    @Positive(message = "Parcel ID must be greater than 0")
    private Long parcelId;


    public String getBuildingNumber() {
        return buildingNumber;
    }

    public void setBuildingNumber(String buildingNumber) {
        this.buildingNumber = buildingNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBuildingType() {
        return buildingType;
    }

    public void setBuildingType(String buildingType) {
        this.buildingType = buildingType;
    }

    public Integer getNumberOfFloors() {
        return numberOfFloors;
    }

    public void setNumberOfFloors(Integer numberOfFloors) {
        this.numberOfFloors = numberOfFloors;
    }

    public Long getParcelId() {
        return parcelId;
    }

    public void setParcelId(Long parcelId) {
        this.parcelId = parcelId;
    }
}