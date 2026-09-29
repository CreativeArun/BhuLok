package com.ulpin.spring_registry.repository;

import com.ulpin.spring_registry.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UnitRepository
        extends JpaRepository<Unit, Long> {

    // Find all units belonging to a specific building + floor
    List<Unit> findByFloorBuildingIdAndFloorId(
            Long buildingId,
            Long floorId
    );

    // Find all units belonging to an owner
    List<Unit> findByOwnerId(Long ownerId);

    // Check whether a unit number already exists on a floor
    boolean existsByUnitNumberAndFloorBuildingIdAndFloorId(
            String unitNumber,
            Long buildingId,
            Long floorId
    );

    // Check duplicate unit number while updating
    boolean existsByUnitNumberAndFloorBuildingIdAndFloorIdAndIdNot(
            String unitNumber,
            Long buildingId,
            Long floorId,
            Long id
    );
}