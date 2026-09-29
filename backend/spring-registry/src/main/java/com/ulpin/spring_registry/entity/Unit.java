package com.ulpin.spring_registry.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumns;
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
                        name = "uk_unit_number_floor",
                        columnNames = {
                                "unitNumber",
                                "floor_id"
                        }
                )
        }
)
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String unitNumber;

    @NotBlank
    private String unitType;

    @NotNull
    @Positive
    private Double area;

    @NotBlank
    private String status;

    // Relationship: Many units can belong to one floor
    @ManyToOne
    @JoinColumns({
            @JoinColumn(
                    name = "building_id",
                    referencedColumnName = "building_id",
                    nullable = false
            ),
            @JoinColumn(
                    name = "floor_id",
                    referencedColumnName = "id",
                    nullable = false
            )
    })
    private Floor floor;
    // Relationship: Many units can belong to one owner
    @ManyToOne
    @JoinColumn(
            name = "owner_id",
            nullable = false
    )
    @NotNull
    private Owner owner;


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
    // GETTER AND SETTER FOR UNIT NUMBER
    // =========================================================

    public String getUnitNumber() {
        return unitNumber;
    }

    public void setUnitNumber(
            String unitNumber) {

        this.unitNumber = unitNumber;
    }


    // =========================================================
    // GETTER AND SETTER FOR UNIT TYPE
    // =========================================================

    public String getUnitType() {
        return unitType;
    }

    public void setUnitType(
            String unitType) {

        this.unitType = unitType;
    }


    // =========================================================
    // GETTER AND SETTER FOR AREA
    // =========================================================

    public Double getArea() {
        return area;
    }

    public void setArea(
            Double area) {

        this.area = area;
    }


    // =========================================================
    // GETTER AND SETTER FOR STATUS
    // =========================================================

    public String getStatus() {
        return status;
    }

    public void setStatus(
            String status) {

        this.status = status;
    }


    // =========================================================
    // GETTER AND SETTER FOR FLOOR
    // =========================================================

    public Floor getFloor() {
        return floor;
    }

    public void setFloor(
            Floor floor) {

        this.floor = floor;
    }


    // =========================================================
    // GETTER AND SETTER FOR OWNER
    // =========================================================

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(
            Owner owner) {

        this.owner = owner;
    }
}
