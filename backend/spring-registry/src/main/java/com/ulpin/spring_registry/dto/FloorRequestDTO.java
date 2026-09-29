package com.ulpin.spring_registry.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class FloorRequestDTO {

    @NotNull(message = "Floor number is required")
    private Integer floorNumber;

    private String floorType;

    @NotNull(message = "Built-up area is required")
    @Positive(message = "Built-up area must be greater than 0")
    private Double builtUpArea;

    @NotNull(message = "Building ID is required")
    @Positive(message = "Building ID must be greater than 0")
    private Long buildingId;


    public Integer getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(Integer floorNumber) {
        this.floorNumber = floorNumber;
    }

    public String getFloorType() {
        return floorType;
    }

    public void setFloorType(String floorType) {
        this.floorType = floorType;
    }

    public Double getBuiltUpArea() {
        return builtUpArea;
    }

    public void setBuiltUpArea(Double builtUpArea) {
        this.builtUpArea = builtUpArea;
    }

    public Long getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(Long buildingId) {
        this.buildingId = buildingId;
    }
}