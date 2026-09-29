package com.ulpin.spring_registry.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.locationtech.jts.geom.Geometry;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_parcel_number",
                        columnNames = "parcelNumber"
                )
        }
)
public class Parcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String parcelNumber;

    @NotBlank
    private String address;

    @NotBlank
    private String district;

    @NotBlank
    private String state;

    @NotNull
    @Positive
    private Double area;

    @NotBlank
    private String landType;

    @Column(columnDefinition = "geometry(Geometry,4326)")
    private Geometry geometry;


    // =========================================================
    // GET ID
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // =========================================================
    // GET PARCEL NUMBER
    // =========================================================

    public String getParcelNumber() {
        return parcelNumber;
    }

    public void setParcelNumber(
            String parcelNumber) {

        this.parcelNumber = parcelNumber;
    }


    // =========================================================
    // GET ADDRESS
    // =========================================================

    public String getAddress() {
        return address;
    }

    public void setAddress(
            String address) {

        this.address = address;
    }


    // =========================================================
    // GET DISTRICT
    // =========================================================

    public String getDistrict() {
        return district;
    }

    public void setDistrict(
            String district) {

        this.district = district;
    }


    // =========================================================
    // GET STATE
    // =========================================================

    public String getState() {
        return state;
    }

    public void setState(
            String state) {

        this.state = state;
    }


    // =========================================================
    // GET AREA
    // =========================================================

    public Double getArea() {
        return area;
    }

    public void setArea(
            Double area) {

        this.area = area;
    }


    // =========================================================
    // GET LAND TYPE
    // =========================================================

    public String getLandType() {
        return landType;
    }

    public void setLandType(
            String landType) {

        this.landType = landType;
    }


    // =========================================================
    // GET GEOMETRY
    // =========================================================

    public Geometry getGeometry() {
        return geometry;
    }

    public void setGeometry(
            Geometry geometry) {

        this.geometry = geometry;
    }
}