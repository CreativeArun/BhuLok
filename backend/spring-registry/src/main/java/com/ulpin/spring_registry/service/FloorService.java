package com.ulpin.spring_registry.service;

import com.ulpin.spring_registry.dto.FloorDTO;
import com.ulpin.spring_registry.dto.FloorRequestDTO;
import com.ulpin.spring_registry.dto.FloorWithUnitsDTO;
import com.ulpin.spring_registry.dto.UnitDTO;
import com.ulpin.spring_registry.entity.Floor;
import com.ulpin.spring_registry.entity.FloorId;
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

    public FloorDTO saveFloor(FloorRequestDTO request) {

        var building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Building not found with id: "
                                        + request.getBuildingId()
                        ));

        boolean duplicate =
                floorRepository.existsByFloorNumberAndBuildingId(
                        request.getFloorNumber(),
                        request.getBuildingId()
                );

        if (duplicate) {
            throw new IllegalArgumentException(
                    "Floor number already exists in this building"
            );
        }

        Floor floor = new Floor();

        floor.setId(
                new FloorId(
                        request.getBuildingId(),
                        request.getFloorNumber().longValue()
                )
        );

        floor.setFloorNumber(request.getFloorNumber());
        floor.setFloorType(request.getFloorType());
        floor.setBuiltUpArea(request.getBuiltUpArea());
        floor.setBuilding(building);

        Floor savedFloor = floorRepository.save(floor);

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
            Long buildingId,
            Long floorId) {

        Floor floor =
                floorRepository.findById(
                        new FloorId(buildingId, floorId)
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Floor not found with building id: "
                                        + buildingId
                                        + " and floor id: "
                                        + floorId
                        ));

        return convertToDTO(floor);
    }

    // =========================================================
    // DELETE FLOOR
    // =========================================================

    public void deleteFloor(
            Long buildingId,
            Long floorId) {

        Floor floor =
                floorRepository.findById(
                        new FloorId(buildingId, floorId)
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Floor not found with building id: "
                                        + buildingId
                                        + " and floor id: "
                                        + floorId
                        ));

        List<Unit> units =
                unitRepository.findByFloorBuildingIdAndFloorId(
                        buildingId,
                        floorId
                );

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
            Long buildingId,
            Long floorId,
            FloorRequestDTO request) {

        Floor floor =
                floorRepository.findById(
                        new FloorId(buildingId, floorId)
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Floor not found with building id: "
                                        + buildingId
                                        + " and floor id: "
                                        + floorId
                        ));

        var newBuilding =
                buildingRepository.findById(request.getBuildingId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Building not found with id: "
                                                + request.getBuildingId()
                                ));

        boolean sameFloor =
                request.getBuildingId().equals(buildingId)
                        && request.getFloorNumber().longValue() == floorId;

        if (!sameFloor) {
            boolean duplicate =
                    floorRepository.existsByFloorNumberAndBuildingId(
                            request.getFloorNumber(),
                            request.getBuildingId()
                    );

            if (duplicate) {
                throw new IllegalArgumentException(
                        "Floor number already exists in this building"
                );
            }

            throw new IllegalArgumentException(
                    "Changing building or floor number is not supported. "
                            + "Create a new floor instead."
            );
        }

        floor.setFloorType(request.getFloorType());
        floor.setBuiltUpArea(request.getBuiltUpArea());
        floor.setBuilding(newBuilding);

        Floor updatedFloor = floorRepository.save(floor);

        return convertToDTO(updatedFloor);
    }

    // =========================================================
    // FIND FLOORS BY BUILDING
    // =========================================================

    public List<FloorDTO> findFloorsByBuilding(
            Long buildingId) {

        buildingRepository.findById(buildingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Building not found with id: "
                                        + buildingId
                        ));

        List<Floor> floors =
                floorRepository.findByBuildingId(buildingId);

        return floors.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET FLOOR WITH ALL UNITS
    // =========================================================

    public FloorWithUnitsDTO getFloorWithUnits(
            Long buildingId,
            Long floorId) {

        Floor floor =
                floorRepository.findById(
                        new FloorId(buildingId, floorId)
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Floor not found with building id: "
                                        + buildingId
                                        + " and floor id: "
                                        + floorId
                        ));

        List<Unit> units =
                unitRepository.findByFloorBuildingIdAndFloorId(
                        buildingId,
                        floorId
                );

        List<UnitDTO> unitDTOs =
                units.stream()
                        .map(this::convertUnitToDTO)
                        .collect(Collectors.toList());

        FloorWithUnitsDTO dto =
                new FloorWithUnitsDTO();

        dto.setId(floor.getId().getId());
        dto.setFloorNumber(floor.getFloorNumber());
        dto.setFloorType(floor.getFloorType());
        dto.setBuiltUpArea(floor.getBuiltUpArea());

        if (floor.getBuilding() != null) {
            dto.setBuildingId(
                    floor.getBuilding().getId()
            );
        }

        dto.setUnits(unitDTOs);

        return dto;
    }

    // =========================================================
    // CONVERT FLOOR ENTITY TO DTO
    // =========================================================

    private FloorDTO convertToDTO(
            Floor floor) {

        FloorDTO dto = new FloorDTO();

        dto.setId(floor.getId().getId());
        dto.setFloorNumber(floor.getFloorNumber());
        dto.setFloorType(floor.getFloorType());
        dto.setBuiltUpArea(floor.getBuiltUpArea());

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

        UnitDTO dto = new UnitDTO();

        dto.setId(unit.getId());
        dto.setUnitNumber(unit.getUnitNumber());
        dto.setUnitType(unit.getUnitType());
        dto.setArea(unit.getArea());
        dto.setStatus(unit.getStatus());

        if (unit.getFloor() != null) {
            dto.setFloorId(
                    unit.getFloor().getId().getId()
            );
        }

        if (unit.getOwner() != null) {
            dto.setOwnerId(unit.getOwner().getId());
        }

        return dto;
    }
}