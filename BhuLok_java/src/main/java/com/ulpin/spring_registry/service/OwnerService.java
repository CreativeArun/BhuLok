package com.ulpin.spring_registry.service;

import com.ulpin.spring_registry.dto.OwnerDTO;
import com.ulpin.spring_registry.dto.OwnerRequestDTO;
import com.ulpin.spring_registry.dto.OwnerWithUnitsDTO;
import com.ulpin.spring_registry.dto.UnitDTO;

import com.ulpin.spring_registry.entity.Owner;
import com.ulpin.spring_registry.entity.Unit;

import com.ulpin.spring_registry.exception.ResourceNotFoundException;

import com.ulpin.spring_registry.repository.OwnerRepository;
import com.ulpin.spring_registry.repository.UnitRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OwnerService {

    private final OwnerRepository ownerRepository;
    private final UnitRepository unitRepository;

    public OwnerService(
            OwnerRepository ownerRepository,
            UnitRepository unitRepository) {

        this.ownerRepository = ownerRepository;
        this.unitRepository = unitRepository;
    }


    // =========================================================
    // CREATE OWNER
    // =========================================================

    public OwnerDTO saveOwner(
            OwnerRequestDTO request) {

        Owner owner = new Owner();

        owner.setName(
                request.getName()
        );

        owner.setEmail(
                request.getEmail()
        );

        owner.setPhone(
                request.getPhone()
        );

        owner.setAddress(
                request.getAddress()
        );


        Owner savedOwner =
                ownerRepository.save(owner);

        return convertToDTO(savedOwner);
    }


    // =========================================================
    // GET ALL OWNERS
    // =========================================================

    public List<OwnerDTO> getAllOwners() {

        return ownerRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET OWNER BY ID
    // =========================================================

    public OwnerDTO getOwnerById(Long id) {

        Owner owner =
                ownerRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Owner not found with id: "
                                                + id
                                ));

        return convertToDTO(owner);
    }


    // =========================================================
    // DELETE OWNER
    // =========================================================

    public void deleteOwner(Long id) {

        Owner owner =
                ownerRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Owner not found with id: "
                                                + id
                                ));


        // FIND UNITS BELONGING TO THIS OWNER
        List<Unit> units =
                unitRepository.findByOwnerId(id);


        // DO NOT DELETE IF UNITS EXIST
        if (!units.isEmpty()) {

            throw new IllegalArgumentException(
                    "Cannot delete owner because units are still associated with it"
            );
        }


        ownerRepository.delete(owner);
    }


    // =========================================================
    // UPDATE OWNER
    // =========================================================

    public OwnerDTO updateOwner(
            Long id,
            OwnerRequestDTO request) {

        Owner owner =
                ownerRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Owner not found with id: "
                                                + id
                                ));


        owner.setName(
                request.getName()
        );

        owner.setEmail(
                request.getEmail()
        );

        owner.setPhone(
                request.getPhone()
        );

        owner.setAddress(
                request.getAddress()
        );


        Owner updatedOwner =
                ownerRepository.save(owner);

        return convertToDTO(updatedOwner);
    }


    // =========================================================
    // GET OWNER WITH ALL UNITS
    // =========================================================

    public OwnerWithUnitsDTO getOwnerWithUnits(
            Long ownerId) {

        Owner owner =
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


        List<UnitDTO> unitDTOs =
                units.stream()
                        .map(this::convertUnitToDTO)
                        .collect(Collectors.toList());


        OwnerWithUnitsDTO dto =
                new OwnerWithUnitsDTO();


        dto.setId(
                owner.getId()
        );

        dto.setName(
                owner.getName()
        );

        dto.setEmail(
                owner.getEmail()
        );

        dto.setPhone(
                owner.getPhone()
        );

        dto.setAddress(
                owner.getAddress()
        );

        dto.setUnits(
                unitDTOs
        );


        return dto;
    }


    // =========================================================
    // CONVERT OWNER ENTITY TO DTO
    // =========================================================

    private OwnerDTO convertToDTO(
            Owner owner) {

        OwnerDTO dto =
                new OwnerDTO();


        dto.setId(
                owner.getId()
        );

        dto.setName(
                owner.getName()
        );

        dto.setEmail(
                owner.getEmail()
        );

        dto.setPhone(
                owner.getPhone()
        );

        dto.setAddress(
                owner.getAddress()
        );


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