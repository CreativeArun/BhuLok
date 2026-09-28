package com.ulpin.spring_registry.controller;

import com.ulpin.spring_registry.dto.FloorDTO;
import com.ulpin.spring_registry.dto.FloorRequestDTO;
import com.ulpin.spring_registry.dto.FloorWithUnitsDTO;
import com.ulpin.spring_registry.service.FloorService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/floors")
public class FloorController {

    private final FloorService floorService;

    public FloorController(FloorService floorService) {
        this.floorService = floorService;
    }

    @PostMapping
    public FloorDTO createFloor(
            @Valid @RequestBody FloorRequestDTO request) {

        return floorService.saveFloor(request);
    }

    @GetMapping
    public List<FloorDTO> getAllFloors() {

        return floorService.getAllFloors();
    }

    @GetMapping("/{id}")
    public FloorDTO getFloorById(
            @PathVariable Long id) {

        return floorService.getFloorById(id);
    }

    @PutMapping("/{id}")
    public FloorDTO updateFloor(
            @PathVariable Long id,
            @Valid @RequestBody FloorRequestDTO request) {

        return floorService.updateFloor(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteFloor(
            @PathVariable Long id) {

        floorService.deleteFloor(id);

        return "Floor deleted successfully";
    }

    @GetMapping("/by-building/{buildingId}")
    public List<FloorDTO> findFloorsByBuilding(
            @PathVariable Long buildingId) {

        return floorService.findFloorsByBuilding(buildingId);
    }

    @GetMapping("/{id}/with-units")
    public FloorWithUnitsDTO getFloorWithUnits(
            @PathVariable Long id) {

        return floorService.getFloorWithUnits(id);
    }
}