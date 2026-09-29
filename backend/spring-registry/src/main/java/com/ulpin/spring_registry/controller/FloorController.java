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

    @GetMapping("/{buildingId}/{floorId}")
    public FloorDTO getFloorById(
            @PathVariable Long buildingId,
            @PathVariable Long floorId) {

        return floorService.getFloorById(
                buildingId,
                floorId
        );
    }

    @PutMapping("/{buildingId}/{floorId}")
    public FloorDTO updateFloor(
            @PathVariable Long buildingId,
            @PathVariable Long floorId,
            @Valid @RequestBody FloorRequestDTO request) {

        return floorService.updateFloor(
                buildingId,
                floorId,
                request
        );
    }

    @DeleteMapping("/{buildingId}/{floorId}")
    public String deleteFloor(
            @PathVariable Long buildingId,
            @PathVariable Long floorId) {

        floorService.deleteFloor(
                buildingId,
                floorId
        );

        return "Floor deleted successfully";
    }

    @GetMapping("/by-building/{buildingId}")
    public List<FloorDTO> findFloorsByBuilding(
            @PathVariable Long buildingId) {

        return floorService.findFloorsByBuilding(
                buildingId
        );
    }

    @GetMapping("/{buildingId}/{floorId}/with-units")
    public FloorWithUnitsDTO getFloorWithUnits(
            @PathVariable Long buildingId,
            @PathVariable Long floorId) {

        return floorService.getFloorWithUnits(
                buildingId,
                floorId
        );
    }
}