package com.ulpin.spring_registry.repository;

import com.ulpin.spring_registry.entity.Floor;
import com.ulpin.spring_registry.entity.FloorId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FloorRepository
        extends JpaRepository<Floor, FloorId> {

    List<Floor> findByBuildingId(Long buildingId);

    boolean existsByFloorNumberAndBuildingId(
            Integer floorNumber,
            Long buildingId
    );

    boolean existsByFloorNumberAndBuildingIdAndId_IdNot(
            Integer floorNumber,
            Long buildingId,
            Long id
    );
}
