package com.ulpin.spring_registry.service;

import com.ulpin.spring_registry.dto.UnitDTO;
import com.ulpin.spring_registry.dto.UnitRequestDTO;

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

    public UnitDTO saveUnit(
            UnitRequestDTO request) {

        // Check whether floor exists
        floorRepository.findById(request.getFloorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Floor not found with id: "
                                        + request.getFloorId()
                        ));


        // Check whether owner exists
        ownerRepository.findById(request.getOwnerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Owner not found with id: "
                                        + request.getOwnerId()
                        ));


        // Check duplicate unit number on same floor
        boolean duplicate =
                unitRepository.existsByUnitNumberAndFloorId(
                        request.getUnitNumber(),
                        request.getFloorId()
                );

        if (duplicate) {

            throw new IllegalArgumentException(
                    "Unit number already exists on this floor"
            );
        }


        Unit unit = new Unit();


        unit.setUnitNumber(
                request.getUnitNumber()
        );

        unit.setUnitType(
                request.getUnitType()
        );

        unit.setArea(
                request.getArea()
        );

        unit.setStatus(
                request.getStatus()
        );


        // Set floor
        unit.setFloor(
                floorRepository.findById(
                        request.getFloorId()
                ).orElseThrow()
        );


        // Set owner
        unit.setOwner(
                ownerRepository.findById(
                        request.getOwnerId()
                ).orElseThrow()
        );


        Unit savedUnit =
                unitRepository.save(unit);


        return convertToDTO(savedUnit);
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

    public UnitDTO getUnitById(
            Long id) {

        Unit unit =
                unitRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Unit not found with id: "
                                                + id
                                ));

        return convertToDTO(unit);
    }


    // =========================================================
    // DELETE UNIT
    // =========================================================

    public void deleteUnit(
            Long id) {

        Unit unit =
                unitRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Unit not found with id: "
                                                + id
                                ));

        unitRepository.delete(unit);
    }


    // =========================================================
    // UPDATE UNIT
    // =========================================================

    public UnitDTO updateUnit(
            Long id,
            UnitRequestDTO request) {

        // Find existing unit
        Unit unit =
                unitRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Unit not found with id: "
                                                + id
                                ));


        // Check floor
        floorRepository.findById(
                        request.getFloorId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Floor not found with id: "
                                        + request.getFloorId()
                        ));


        // Check owner
        ownerRepository.findById(
                        request.getOwnerId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Owner not found with id: "
                                        + request.getOwnerId()
                        ));


        // Check duplicate unit number
        // while excluding current unit
        boolean duplicate =
                unitRepository
                        .existsByUnitNumberAndFloorIdAndIdNot(
                                request.getUnitNumber(),
                                request.getFloorId(),
                                id
                        );

        if (duplicate) {

            throw new IllegalArgumentException(
                    "Unit number already exists on this floor"
            );
        }


        // Update unit information
        unit.setUnitNumber(
                request.getUnitNumber()
        );

        unit.setUnitType(
                request.getUnitType()
        );

        unit.setArea(
                request.getArea()
        );

        unit.setStatus(
                request.getStatus()
        );


        // Update floor
        unit.setFloor(
                floorRepository.findById(
                        request.getFloorId()
                ).orElseThrow()
        );


        // Update owner
        unit.setOwner(
                ownerRepository.findById(
                        request.getOwnerId()
                ).orElseThrow()
        );


        Unit updatedUnit =
                unitRepository.save(unit);


        return convertToDTO(updatedUnit);
    }


    // =========================================================
    // FIND ALL UNITS BELONGING TO A FLOOR
    // =========================================================

    public List<UnitDTO> findUnitsByFloor(
            Long floorId) {

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


        return units.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // FIND ALL UNITS BELONGING TO AN OWNER
    // =========================================================

    public List<UnitDTO> findUnitsByOwner(
            Long ownerId) {

        ownerRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Owner not found with id: "
                                        + ownerId
                        ));


        List<Unit> units =
                unitRepository.findByOwnerId(
                        ownerId
                );


        return units.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // CONVERT UNIT ENTITY TO DTO
    // =========================================================

    private UnitDTO convertToDTO(
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