package com.ulpin.spring_registry.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class FloorId implements Serializable {

    private Long buildingId;

    private Long id;

    public FloorId() {
    }

    public FloorId(Long buildingId, Long id) {
        this.buildingId = buildingId;
        this.id = id;
    }

    public Long getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(Long buildingId) {
        this.buildingId = buildingId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FloorId)) return false;

        FloorId floorId = (FloorId) o;

        return Objects.equals(buildingId, floorId.buildingId)
                && Objects.equals(id, floorId.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(buildingId, id);
    }
}
