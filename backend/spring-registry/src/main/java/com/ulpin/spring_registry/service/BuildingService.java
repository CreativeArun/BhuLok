package com.ulpin.spring_registry.service;

import com.ulpin.spring_registry.dto.BuildingDTO;
import com.ulpin.spring_registry.dto.BuildingRequestDTO;
import com.ulpin.spring_registry.dto.BuildingWithFloorsDTO;
import com.ulpin.spring_registry.dto.FloorDTO;

import com.ulpin.spring_registry.entity.Building;
import com.ulpin.spring_registry.entity.Floor;

import com.ulpin.spring_registry.exception.ResourceNotFoundException;

import com.ulpin.spring_registry.repository.BuildingRepository;
import com.ulpin.spring_registry.repository.FloorRepository;
import com.ulpin.spring_registry.repository.ParcelRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final ParcelRepository parcelRepository;
    private final FloorRepository floorRepository;

    public BuildingService(
            BuildingRepository buildingRepository,
            ParcelRepository parcelRepository,
            FloorRepository floorRepository) {

        this.buildingRepository = buildingRepository;
        this.parcelRepository = parcelRepository;
        this.floorRepository = floorRepository;
    }


    // =========================================================
    // CREATE BUILDING
    // =========================================================

    public BuildingDTO saveBuilding(
            BuildingRequestDTO request) {

        // Check whether parcel exists
        parcelRepository.findById(request.getParcelId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parcel not found with id: "
                                        + request.getParcelId()
                        ));


        // Check duplicate building number
        // inside the same parcel
        boolean duplicate =
                buildingRepository
                        .existsByBuildingNumberAndParcelId(
                                request.getBuildingNumber(),
                                request.getParcelId()
                        );


        if (duplicate) {

            throw new IllegalArgumentException(
                    "Building number already exists in this parcel"
            );
        }


        Building building = new Building();

        building.setBuildingNumber(
                request.getBuildingNumber()
        );

        building.setName(
                request.getName()
        );

        building.setBuildingType(
                request.getBuildingType()
        );

        building.setNumberOfFloors(
                request.getNumberOfFloors()
        );


        building.setParcel(
                parcelRepository.findById(
                        request.getParcelId()
                ).orElseThrow()
        );


        Building savedBuilding =
                buildingRepository.save(building);


        return convertToDTO(savedBuilding);
    }


    // =========================================================
    // GET ALL BUILDINGS
    // =========================================================

    public List<BuildingDTO> getAllBuildings() {

        return buildingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET BUILDING BY ID
    // =========================================================

    public BuildingDTO getBuildingById(
            Long id) {

        Building building =
                buildingRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Building not found with id: "
                                                + id
                                ));


        return convertToDTO(building);
    }


    // =========================================================
    // DELETE BUILDING
    // =========================================================

    public void deleteBuilding(
            Long id) {

        Building building =
                buildingRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Building not found with id: "
                                                + id
                                ));


        // Check whether floors are associated
        List<Floor> floors =
                floorRepository.findByBuildingId(id);


        if (!floors.isEmpty()) {

            throw new IllegalArgumentException(
                    "Cannot delete building because floors are still associated with it"
            );
        }


        buildingRepository.delete(building);
    }


    // =========================================================
    // UPDATE BUILDING
    // =========================================================

    public BuildingDTO updateBuilding(
            Long id,
            BuildingRequestDTO request) {

        // Find existing building
        Building building =
                buildingRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Building not found with id: "
                                                + id
                                ));


        // Check whether parcel exists
        parcelRepository.findById(request.getParcelId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parcel not found with id: "
                                        + request.getParcelId()
                        ));


        // Check duplicate building number
        // while excluding current building
        boolean duplicate =
                buildingRepository
                        .existsByBuildingNumberAndParcelIdAndIdNot(
                                request.getBuildingNumber(),
                                request.getParcelId(),
                                id
                        );


        if (duplicate) {

            throw new IllegalArgumentException(
                    "Building number already exists in this parcel"
            );
        }


        // Get existing floors of this building
        List<Floor> existingFloors =
                floorRepository.findByBuildingId(id);


        // Make sure the new floor count is not
        // smaller than the number of existing floors
        if (request.getNumberOfFloors()
                < existingFloors.size()) {

            throw new IllegalArgumentException(
                    "Number of floors cannot be less than the existing number of floors"
            );
        }


        building.setBuildingNumber(
                request.getBuildingNumber()
        );

        building.setName(
                request.getName()
        );

        building.setBuildingType(
                request.getBuildingType()
        );

        building.setNumberOfFloors(
                request.getNumberOfFloors()
        );


        building.setParcel(
                parcelRepository.findById(
                        request.getParcelId()
                ).orElseThrow()
        );


        Building updatedBuilding =
                buildingRepository.save(building);


        return convertToDTO(updatedBuilding);
    }


    // =========================================================
    // FIND ALL BUILDINGS BELONGING TO A PARCEL
    // =========================================================

    public List<BuildingDTO> findBuildingsByParcel(
            Long parcelId) {

        // Check whether parcel exists
        parcelRepository.findById(parcelId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parcel not found with id: "
                                        + parcelId
                        ));


        List<Building> buildings =
                buildingRepository.findByParcelId(
                        parcelId
                );


        return buildings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET BUILDING WITH ALL FLOORS
    // =========================================================

    public BuildingWithFloorsDTO getBuildingWithFloors(
            Long buildingId) {

        Building building =
                buildingRepository.findById(buildingId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Building not found with id: "
                                                + buildingId
                                ));


        List<Floor> floors =
                floorRepository.findByBuildingId(
                        buildingId
                );


        List<FloorDTO> floorDTOs =
                floors.stream()
                        .map(this::convertFloorToDTO)
                        .collect(Collectors.toList());


        BuildingWithFloorsDTO dto =
                new BuildingWithFloorsDTO();


        dto.setId(
                building.getId()
        );

        dto.setBuildingNumber(
                building.getBuildingNumber()
        );

        dto.setName(
                building.getName()
        );

        dto.setBuildingType(
                building.getBuildingType()
        );

        dto.setNumberOfFloors(
                building.getNumberOfFloors()
        );


        if (building.getParcel() != null) {

            dto.setParcelId(
                    building.getParcel().getId()
            );
        }


        dto.setFloors(
                floorDTOs
        );


        return dto;
    }


    // =========================================================
    // CONVERT BUILDING ENTITY TO DTO
    // =========================================================

    private BuildingDTO convertToDTO(
            Building building) {

        BuildingDTO dto =
                new BuildingDTO();


        dto.setId(
                building.getId()
        );

        dto.setBuildingNumber(
                building.getBuildingNumber()
        );

        dto.setName(
                building.getName()
        );

        dto.setBuildingType(
                building.getBuildingType()
        );

        dto.setNumberOfFloors(
                building.getNumberOfFloors()
        );


        if (building.getParcel() != null) {

            dto.setParcelId(
                    building.getParcel().getId()
            );
        }


        return dto;
    }


    // =========================================================
    // CONVERT FLOOR ENTITY TO DTO
    // =========================================================

    private FloorDTO convertFloorToDTO(
            Floor floor) {

        FloorDTO dto =
                new FloorDTO();


        dto.setId(
                floor.getId().getId()
        );

        dto.setFloorNumber(
                floor.getFloorNumber()
        );

        dto.setFloorType(
                floor.getFloorType()
        );

        dto.setBuiltUpArea(
                floor.getBuiltUpArea()
        );


        if (floor.getBuilding() != null) {

            dto.setBuildingId(
                    floor.getBuilding().getId()
            );
        }


        return dto;
    }
}