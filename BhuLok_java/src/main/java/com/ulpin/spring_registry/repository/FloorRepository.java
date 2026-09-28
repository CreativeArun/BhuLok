package com.ulpin.spring_registry.repository;

import com.ulpin.spring_registry.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FloorRepository
        extends JpaRepository<Floor, Long> {

    // Find all floors belonging to a building
    List<Floor> findByBuildingId(Long buildingId);

    // Check duplicate floor number inside a building
    boolean existsByFloorNumberAndBuildingId(
            Integer floorNumber,
            Long buildingId
    );

    // Check duplicate floor number during update
    // while excluding the current floor
    boolean existsByFloorNumberAndBuildingIdAndIdNot(
            Integer floorNumber,
            Long buildingId,
            Long id
    );
}