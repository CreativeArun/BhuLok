package com.ulpin.spring_registry.service;

import com.ulpin.spring_registry.dto.UnitDTO;
import com.ulpin.spring_registry.dto.UnitRequestDTO;
import com.ulpin.spring_registry.entity.Floor;
import com.ulpin.spring_registry.entity.FloorId;
import com.ulpin.spring_registry.entity.Unit;
import com.ulpin.spring_registry.exception.ResourceNotFoundException;
import com.ulpin.spring_registry.repository.FloorRepository;
import com.ulpin.spring_registry.repository.OwnerRepository;
import com.ulpin.spring_registry.repository.UnitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UnitService {

    private final UnitRepository unitRepository;
    private final FloorRepository floorRepository;
    private final OwnerRepository ownerRepository;

    public UnitService(
            UnitRepository unitRepository,
            FloorRepository floorRepository,
            OwnerRepository ownerRepository) {

        this.unitRepository = unitRepository;
        this.floorRepository = floorRepository;
        this.ownerRepository = ownerRepository;
    }

    // =========================================================
    // CREATE UNIT
    // =========================================================

    public UnitDTO saveUnit(UnitRequestDTO request) {

        Floor floor =
                floorRepository.findById(
                        new FloorId(
                                request.getBuildingId(),
                                request.getFloorId()
                        )
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Floor not found with building id: "
                                        + request.getBuildingId()
                                        + " and floor id: "
                                        + request.getFloorId()
                        ));

        var owner =
                ownerRepository.findById(request.getOwnerId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Owner not found with id: "
                                                + request.getOwnerId()
                                ));

        boolean duplicate =
                unitRepository
                        .existsByUnitNumberAndFloorBuildingIdAndFloorId(
                                request.getUnitNumber(),
                                request.getBuildingId(),
                                request.getFloorId()
                        );

        if (duplicate) {
            throw new IllegalArgumentException(
                    "Unit number already exists on this floor"
            );
        }

        Unit unit = new Unit();

        unit.setUnitNumber(request.getUnitNumber());
        unit.setUnitType(request.getUnitType());
        unit.setArea(request.getArea());
        unit.setStatus(request.getStatus());
        unit.setFloor(floor);
        unit.setOwner(owner);

        return convertToDTO(unitRepository.save(unit));
    }

    // =========================================================
    // GET ALL UNITS
    // =========================================================

    public List<UnitDTO> getAllUnits() {

        return unitRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET UNIT BY ID
    // =========================================================

    public UnitDTO getUnitById(Long id) {

        Unit unit =
                unitRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Unit not found with id: " + id
                                ));

        return convertToDTO(unit);
    }

    // =========================================================
    // DELETE UNIT
    // =========================================================

    public void deleteUnit(Long id) {

        Unit unit =
                unitRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Unit not found with id: " + id
                                ));

        unitRepository.delete(unit);
    }

    // =========================================================
    // UPDATE UNIT
    // =========================================================

    public UnitDTO updateUnit(
            Long id,
            UnitRequestDTO request) {

        Unit unit =
                unitRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Unit not found with id: " + id
                                ));

        Floor floor =
                floorRepository.findById(
                        new FloorId(
                                request.getBuildingId(),
                                request.getFloorId()
                        )
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Floor not found with building id: "
                                        + request.getBuildingId()
                                        + " and floor id: "
                                        + request.getFloorId()
                        ));

        var owner =
                ownerRepository.findById(request.getOwnerId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Owner not found with id: "
                                                + request.getOwnerId()
                                ));

        boolean duplicate =
                unitRepository
                        .existsByUnitNumberAndFloorBuildingIdAndFloorIdAndIdNot(
                                request.getUnitNumber(),
                                request.getBuildingId(),
                                request.getFloorId(),
                                id
                        );

        if (duplicate) {
            throw new IllegalArgumentException(
                    "Unit number already exists on this floor"
            );
        }

        unit.setUnitNumber(request.getUnitNumber());
        unit.setUnitType(request.getUnitType());
        unit.setArea(request.getArea());
        unit.setStatus(request.getStatus());
        unit.setFloor(floor);
        unit.setOwner(owner);

        return convertToDTO(unitRepository.save(unit));
    }

    // =========================================================
    // FIND UNITS BY FLOOR
    // =========================================================

    public List<UnitDTO> findUnitsByFloor(
            Long buildingId,
            Long floorId) {

        floorRepository.findById(
                new FloorId(buildingId, floorId)
        ).orElseThrow(() ->
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

        return units.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // FIND UNITS BY OWNER
    // =========================================================

    public List<UnitDTO> findUnitsByOwner(Long ownerId) {

        ownerRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Owner not found with id: "
                                        + ownerId
                        ));

        return unitRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // CONVERT UNIT ENTITY TO DTO
    // =========================================================

    private UnitDTO convertToDTO(Unit unit) {

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
            dto.setOwnerId(
                    unit.getOwner().getId()
            );
        }

        return dto;
    }
}