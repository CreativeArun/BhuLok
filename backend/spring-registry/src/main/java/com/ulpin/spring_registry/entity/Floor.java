package com.ulpin.spring_registry.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_floor_number_building",
                        columnNames = {
                                "floorNumber",
                                "building_id"
                        }
                )
        }
)
public class Floor {

    @EmbeddedId
    private FloorId id;

    @NotNull
    private Integer floorNumber;

    @NotBlank
    private String floorType;

    @NotNull
    @Positive
    private Double builtUpArea;

    @ManyToOne
    @MapsId("buildingId")
    @JoinColumn(
            name = "building_id",
            nullable = false
    )
    @NotNull
    private Building building;


    public FloorId getId() {
        return id;
    }

    public void setId(FloorId id) {
        this.id = id;
    }

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

    public Building getBuilding() {
        return building;
    }

    public void setBuilding(Building building) {
        this.building = building;
    }
}
