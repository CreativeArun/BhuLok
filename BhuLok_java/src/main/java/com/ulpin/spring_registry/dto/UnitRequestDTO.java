package com.ulpin.spring_registry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class UnitRequestDTO {

    @NotBlank(message = "Unit number is required")
    private String unitNumber;

    @NotBlank(message = "Unit type is required")
    private String unitType;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be greater than 0")
    private Double area;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Floor ID is required")
    @Positive(message = "Floor ID must be greater than 0")
    private Long floorId;

    @NotNull(message = "Owner ID is required")
    @Positive(message = "Owner ID must be greater than 0")
    private Long ownerId;


    public String getUnitNumber() {
        return unitNumber;
    }

    public void setUnitNumber(String unitNumber) {
        this.unitNumber = unitNumber;
    }

    public String getUnitType() {
        return unitType;
    }

    public void setUnitType(String unitType) {
        this.unitType = unitType;
    }

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getFloorId() {
        return floorId;
    }

    public void setFloorId(Long floorId) {
        this.floorId = floorId;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
}