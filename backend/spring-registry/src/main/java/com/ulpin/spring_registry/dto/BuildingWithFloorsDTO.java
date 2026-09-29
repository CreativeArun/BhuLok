package com.ulpin.spring_registry.dto;

import java.util.List;

public class BuildingWithFloorsDTO {

    private Long id;
    private String buildingNumber;
    private String name;
    private String buildingType;
    private Integer numberOfFloors;

    private Long parcelId;

    private List<FloorDTO> floors;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public List<FloorDTO> getFloors() {
        return floors;
    }

    public void setFloors(List<FloorDTO> floors) {
        this.floors = floors;
    }
}