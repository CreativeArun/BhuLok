package com.ulpin.spring_registry.repository;

import com.ulpin.spring_registry.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingRepository
        extends JpaRepository<Building, Long> {

    // Find all buildings belonging to a parcel
    List<Building> findByParcelId(Long parcelId);

    // Check duplicate building number inside a parcel
    boolean existsByBuildingNumberAndParcelId(
            String buildingNumber,
            Long parcelId
    );

    // Check duplicate building number during update
    // while excluding the current building
    boolean existsByBuildingNumberAndParcelIdAndIdNot(
            String buildingNumber,
            Long parcelId,
            Long id
    );
}