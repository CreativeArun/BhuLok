package com.ulpin.spring_registry.dto;

public class ParcelDTO {

    private Long id;
    private String parcelNumber;
    private String address;
    private String district;
    private String state;
    private Double area;
    private String landType;
    private GeometryDTO geometry;


    // Get ID
    public Long getId() {
        return id;
    }

    // Set ID
    public void setId(Long id) {
        this.id = id;
    }


    // Get Parcel Number
    public String getParcelNumber() {
        return parcelNumber;
    }

    // Set Parcel Number
    public void setParcelNumber(String parcelNumber) {
        this.parcelNumber = parcelNumber;
    }


    // Get Address
    public String getAddress() {
        return address;
    }

    // Set Address
    public void setAddress(String address) {
        this.address = address;
    }


    // Get District
    public String getDistrict() {
        return district;
    }

    // Set District
    public void setDistrict(String district) {
        this.district = district;
    }


    // Get State
    public String getState() {
        return state;
    }

    // Set State
    public void setState(String state) {
        this.state = state;
    }


    // Get Area
    public Double getArea() {
        return area;
    }

    // Set Area
    public void setArea(Double area) {
        this.area = area;
    }


    // Get Land Type
    public String getLandType() {
        return landType;
    }

    // Set Land Type
    public void setLandType(String landType) {
        this.landType = landType;
    }


    // Get Geometry
    public GeometryDTO getGeometry() {
        return geometry;
    }

    // Set Geometry
    public void setGeometry(GeometryDTO geometry) {
        this.geometry = geometry;
    }
}