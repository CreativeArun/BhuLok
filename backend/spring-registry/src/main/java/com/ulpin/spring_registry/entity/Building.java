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
                        name = "uk_building_number_parcel",
                        columnNames = {
                                "buildingNumber",
                                "parcel_id"
                        }
                )
        }
)
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String buildingNumber;

    private String name;

    @NotBlank
    private String buildingType;

    @NotNull
    @Positive
    private Integer numberOfFloors;

    // Relationship:
    // Many buildings can belong to one parcel
    @ManyToOne
    @JoinColumn(
            name = "parcel_id",
            nullable = false
    )
    @NotNull
    private Parcel parcel;


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
    // GETTER AND SETTER FOR BUILDING NUMBER
    // =========================================================

    public String getBuildingNumber() {
        return buildingNumber;
    }

    public void setBuildingNumber(
            String buildingNumber) {

        this.buildingNumber = buildingNumber;
    }


    // =========================================================
    // GETTER AND SETTER FOR NAME
    // =========================================================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    // =========================================================
    // GETTER AND SETTER FOR BUILDING TYPE
    // =========================================================

    public String getBuildingType() {
        return buildingType;
    }

    public void setBuildingType(
            String buildingType) {

        this.buildingType = buildingType;
    }


    // =========================================================
    // GETTER AND SETTER FOR NUMBER OF FLOORS
    // =========================================================

    public Integer getNumberOfFloors() {
        return numberOfFloors;
    }

    public void setNumberOfFloors(
            Integer numberOfFloors) {

        this.numberOfFloors = numberOfFloors;
    }


    // =========================================================
    // GETTER AND SETTER FOR PARCEL
    // =========================================================

    public Parcel getParcel() {
        return parcel;
    }

    public void setParcel(Parcel parcel) {
        this.parcel = parcel;
    }
}