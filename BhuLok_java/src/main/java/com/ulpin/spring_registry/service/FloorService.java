package com.ulpin.spring_registry.service;

import com.ulpin.spring_registry.dto.FloorDTO;
import com.ulpin.spring_registry.dto.FloorRequestDTO;
import com.ulpin.spring_registry.dto.FloorWithUnitsDTO;
import com.ulpin.spring_registry.dto.UnitDTO;

import com.ulpin.spring_registry.entity.Floor;
import com.ulpin.spring_registry.entity.Unit;

import com.ulpin.spring_registry.exception.ResourceNotFoundException;

import com.ulpin.spring_registry.repository.BuildingRepository;
import com.ulpin.spring_registry.repository.FloorRepository;
import com.ulpin.spring_registry.repository.UnitRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FloorService {

    private final FloorRepository floorRepository;
    private final BuildingRepository buildingRepository;
    private final UnitRepository unitRepository;

    public FloorService(
            FloorRepository floorRepository,
            BuildingRepository buildingRepository,
            UnitRepository unitRepository) {

        this.floorRepository = floorRepository;
        this.buildingRepository = buildingRepository;
        this.unitRepository = unitRepository;
    }


    // =========================================================
    // CREATE FLOOR
    // =========================================================

    public FloorDTO saveFloor(
            FloorRequestDTO request) {

        // Check whether building exists
        buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Building not found with id: "
                                        + request.getBuildingId()
                        ));


        // Check duplicate floor number
        // inside the same building
        boolean duplicate =
                floorRepository
                        .existsByFloorNumberAndBuildingId(
                                request.getFloorNumber(),
                                request.getBuildingId()
                        );


        if (duplicate) {

            throw new IllegalArgumentException(
                    "Floor number already exists in this building"
            );
        }


        Floor floor = new Floor();

        floor.setFloorNumber(
                request.getFloorNumber()
        );

        floor.setFloorType(
                request.getFloorType()
        );

        floor.setBuiltUpArea(
                request.getBuiltUpArea()
        );


        floor.setBuilding(
                buildingRepository.findById(
                        request.getBuildingId()
                ).orElseThrow()
        );


        Floor savedFloor =
                floorRepository.save(floor);


        return convertToDTO(savedFloor);
    }


    // =========================================================
    // GET ALL FLOORS
    // =========================================================

    public List<FloorDTO> getAllFloors() {

        return floorRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET FLOOR BY ID
    // =========================================================

    public FloorDTO getFloorById(
            Long id) {

        Floor floor =
                floorRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Floor not found with id: "
                                                + id
                                ));


        return convertToDTO(floor);
    }


    // =========================================================
    // DELETE FLOOR
    // =========================================================

    public void deleteFloor(
            Long id) {

        Floor floor =
                floorRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Floor not found with id: "
                                                + id
                                ));


        // Check whether units are associated
        List<Unit> units =
                unitRepository.findByFloorId(id);


        if (!units.isEmpty()) {

            throw new IllegalArgumentException(
                    "Cannot delete floor because units are still associated with it"
            );
        }


        floorRepository.delete(floor);
    }


    // =========================================================
    // UPDATE FLOOR
    // =========================================================

    public FloorDTO updateFloor(
            Long id,
            FloorRequestDTO request) {

        // Find existing floor
        Floor floor =
                floorRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Floor not found with id: "
                                                + id
                                ));


        // Check whether building exists
        buildingRepository.findById(
                        request.getBuildingId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Building not found with id: "
                                        + request.getBuildingId()
                        ));


        // Check duplicate floor number
        // while excluding current floor
        boolean duplicate =
                floorRepository
                        .existsByFloorNumberAndBuildingIdAndIdNot(
                                request.getFloorNumber(),
                                request.getBuildingId(),
                                id
                        );


        if (duplicate) {

            throw new IllegalArgumentException(
                    "Floor number already exists in this building"
            );
        }


        floor.setFloorNumber(
                request.getFloorNumber()
        );

        floor.setFloorType(
                request.getFloorType()
        );

        floor.setBuiltUpArea(
                request.getBuiltUpArea()
        );


        floor.setBuilding(
                buildingRepository.findById(
                        request.getBuildingId()
                ).orElseThrow()
        );


        Floor updatedFloor =
                floorRepository.save(floor);


        return convertToDTO(updatedFloor);
    }


    // =========================================================
    // FIND FLOORS BY BUILDING
    // =========================================================

    public List<FloorDTO> findFloorsByBuilding(
            Long buildingId) {

        // Check whether building exists
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


        return floors.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET FLOOR WITH ALL UNITS
    // =========================================================

    public FloorWithUnitsDTO getFloorWithUnits(
            Long floorId) {

        Floor floor =
                floorRepository.findById(floorId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Floor not found with id: "
                                                + floorId
                                ));


        List<Unit> units =
                unitRepository.findByFloorId(
                        floorId
                );


        List<UnitDTO> unitDTOs =
                units.stream()
                        .map(this::convertUnitToDTO)
                        .collect(Collectors.toList());


        FloorWithUnitsDTO dto =
                new FloorWithUnitsDTO();


        dto.setId(
                floor.getId()
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


        dto.setUnits(
                unitDTOs
        );


        return dto;
    }


    // =========================================================
    // CONVERT FLOOR ENTITY TO DTO
    // =========================================================

    private FloorDTO convertToDTO(
            Floor floor) {

        FloorDTO dto =
                new FloorDTO();


        dto.setId(
                floor.getId()
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


    // =========================================================
    // CONVERT UNIT ENTITY TO DTO
    // =========================================================

    private UnitDTO convertUnitToDTO(
            Unit unit) {

        UnitDTO dto =
                new UnitDTO();


        dto.setId(
                unit.getId()
        );

        dto.setUnitNumber(
                unit.getUnitNumber()
        );

        dto.setUnitType(
                unit.getUnitType()
        );

        dto.setArea(
                unit.getArea()
        );

        dto.setStatus(
                unit.getStatus()
        );


        if (unit.getFloor() != null) {

            dto.setFloorId(
                    unit.getFloor().getId()
            );
        }


        if (unit.getOwner() != null) {

            dto.setOwnerId(
                    unit.getOwner().getId()
            );
        }


        return dto;
    }
}