package com.ulpin.spring_registry.controller;

import com.ulpin.spring_registry.dto.UnitDTO;
import com.ulpin.spring_registry.dto.UnitRequestDTO;
import com.ulpin.spring_registry.service.UnitService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    // CREATE UNIT
    @PostMapping
    public UnitDTO createUnit(
            @Valid @RequestBody UnitRequestDTO request) {

        return unitService.saveUnit(request);
    }

    // GET ALL UNITS
    @GetMapping
    public List<UnitDTO> getAllUnits() {

        return unitService.getAllUnits();
    }

    // GET UNIT BY ID
    @GetMapping("/{id}")
    public UnitDTO getUnitById(
            @PathVariable Long id) {

        return unitService.getUnitById(id);
    }

    // DELETE UNIT
    @DeleteMapping("/{id}")
    public String deleteUnit(
            @PathVariable Long id) {

        unitService.deleteUnit(id);

        return "Unit deleted successfully";
    }

    // UPDATE UNIT
    @PutMapping("/{id}")
    public UnitDTO updateUnit(
            @PathVariable Long id,
            @Valid @RequestBody UnitRequestDTO request) {

        return unitService.updateUnit(
                id,
                request
        );
    }

    // FIND ALL UNITS BELONGING TO A BUILDING + FLOOR
    @GetMapping("/by-floor/{buildingId}/{floorId}")
    public List<UnitDTO> findUnitsByFloor(
            @PathVariable Long buildingId,
            @PathVariable Long floorId) {

        return unitService.findUnitsByFloor(
                buildingId,
                floorId
        );
    }

    // FIND ALL UNITS BELONGING TO AN OWNER
    @GetMapping("/by-owner/{ownerId}")
    public List<UnitDTO> findUnitsByOwner(
            @PathVariable Long ownerId) {

        return unitService.findUnitsByOwner(ownerId);
    }
}