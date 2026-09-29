package com.ulpin.spring_registry.controller;

import com.ulpin.spring_registry.dto.BuildingDTO;
import com.ulpin.spring_registry.dto.BuildingRequestDTO;
import com.ulpin.spring_registry.dto.BuildingWithFloorsDTO;
import com.ulpin.spring_registry.service.BuildingService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    private final BuildingService buildingService;

    public BuildingController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }

    @PostMapping
    public BuildingDTO createBuilding(
            @Valid @RequestBody BuildingRequestDTO request) {

        return buildingService.saveBuilding(request);
    }

    @GetMapping
    public List<BuildingDTO> getAllBuildings() {

        return buildingService.getAllBuildings();
    }

    @GetMapping("/{id}")
    public BuildingDTO getBuildingById(
            @PathVariable Long id) {

        return buildingService.getBuildingById(id);
    }

    @PutMapping("/{id}")
    public BuildingDTO updateBuilding(
            @PathVariable Long id,
            @Valid @RequestBody BuildingRequestDTO request) {

        return buildingService.updateBuilding(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteBuilding(
            @PathVariable Long id) {

        buildingService.deleteBuilding(id);

        return "Building deleted successfully";
    }

    @GetMapping("/by-parcel/{parcelId}")
    public List<BuildingDTO> findBuildingsByParcel(
            @PathVariable Long parcelId) {

        return buildingService.findBuildingsByParcel(parcelId);
    }

    @GetMapping("/{id}/with-floors")
    public BuildingWithFloorsDTO getBuildingWithFloors(
            @PathVariable Long id) {

        return buildingService.getBuildingWithFloors(id);
    }
}