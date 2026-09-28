package com.ulpin.spring_registry.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Integer floorNumber;

    @NotBlank
    private String floorType;

    @NotNull
    @Positive
    private Double builtUpArea;

    // Relationship:
    // Many floors can belong to one building
    @ManyToOne
    @JoinColumn(
            name = "building_id",
            nullable = false
    )
    @NotNull
    private Building building;


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
    // GETTER AND SETTER FOR FLOOR NUMBER
    // =========================================================

    public Integer getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(
            Integer floorNumber) {

        this.floorNumber = floorNumber;
    }


    // =========================================================
    // GETTER AND SETTER FOR FLOOR TYPE
    // =========================================================

    public String getFloorType() {
        return floorType;
    }

    public void setFloorType(
            String floorType) {

        this.floorType = floorType;
    }


    // =========================================================
    // GETTER AND SETTER FOR BUILT-UP AREA
    // =========================================================

    public Double getBuiltUpArea() {
        return builtUpArea;
    }

    public void setBuiltUpArea(
            Double builtUpArea) {

        this.builtUpArea = builtUpArea;
    }


    // =========================================================
    // GETTER AND SETTER FOR BUILDING
    // =========================================================

    public Building getBuilding() {
        return building;
    }

    public void setBuilding(
            Building building) {

        this.building = building;
    }
}