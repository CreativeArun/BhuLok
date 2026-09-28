package com.ulpin.spring_registry.dto;

import java.util.List;

public class GeometryDTO {

    private String type;

    private List<List<List<Double>>> coordinates;


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<List<List<Double>>> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<List<List<Double>>> coordinates) {
        this.coordinates = coordinates;
    }
}