package com.ulpin.spring_registry.controller;

import com.ulpin.spring_registry.dto.DistanceRequestDTO;
import com.ulpin.spring_registry.dto.GeometryDTO;
import com.ulpin.spring_registry.dto.ParcelDTO;
import com.ulpin.spring_registry.dto.ParcelRequestDTO;
import com.ulpin.spring_registry.dto.ParcelWithBuildingsDTO;
import com.ulpin.spring_registry.service.ParcelService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parcels")
public class ParcelController {

    private final ParcelService parcelService;

    public ParcelController(ParcelService parcelService) {
        this.parcelService = parcelService;
    }

    @PostMapping
    public ParcelDTO createParcel(
            @Valid @RequestBody ParcelRequestDTO request) {

        return parcelService.saveParcel(request);
    }

    @GetMapping
    public List<ParcelDTO> getAllParcels() {

        return parcelService.getAllParcels();
    }

    @GetMapping("/{id}")
    public ParcelDTO getParcelById(
            @PathVariable Long id) {

        return parcelService.getParcelById(id);
    }

    @PutMapping("/{id}")
    public ParcelDTO updateParcel(
            @PathVariable Long id,
            @Valid @RequestBody ParcelRequestDTO request) {

        return parcelService.updateParcel(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteParcel(
            @PathVariable Long id) {

        parcelService.deleteParcel(id);

        return "Parcel deleted successfully";
    }

    @PostMapping("/spatial/intersects")
    public List<ParcelDTO> findIntersectingParcels(
            @RequestBody GeometryDTO geometry) {

        return parcelService.findIntersectingParcels(geometry);
    }

    @PostMapping("/spatial/contains")
    public List<ParcelDTO> findContainedParcels(
            @RequestBody GeometryDTO geometry) {

        return parcelService.findContainedParcels(geometry);
    }

    @PostMapping("/spatial/within-distance")
    public List<ParcelDTO> findParcelsWithinDistance(
            @Valid @RequestBody DistanceRequestDTO request) {

        return parcelService.findParcelsWithinDistance(
                request.getLongitude(),
                request.getLatitude(),
                request.getDistance()
        );
    }

    @GetMapping("/search")
    public List<ParcelDTO> searchParcels(
            @RequestParam String district,
            @RequestParam String state,
            @RequestParam String landType) {

        return parcelService.searchParcels(
                district,
                state,
                landType
        );
    }

    @GetMapping("/by-number/{parcelNumber}")
    public List<ParcelDTO> findByParcelNumber(
            @PathVariable String parcelNumber) {

        return parcelService.findParcelsByNumber(parcelNumber);
    }

    @GetMapping("/{id}/with-buildings")
    public ParcelWithBuildingsDTO getParcelWithBuildings(
            @PathVariable Long id) {

        return parcelService.getParcelWithBuildings(id);
    }
}