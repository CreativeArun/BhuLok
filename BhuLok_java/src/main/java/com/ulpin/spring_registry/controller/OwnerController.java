package com.ulpin.spring_registry.controller;

import com.ulpin.spring_registry.dto.OwnerDTO;
import com.ulpin.spring_registry.dto.OwnerRequestDTO;
import com.ulpin.spring_registry.dto.OwnerWithUnitsDTO;
import com.ulpin.spring_registry.service.OwnerService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @PostMapping
    public OwnerDTO createOwner(
            @Valid @RequestBody OwnerRequestDTO request) {

        return ownerService.saveOwner(request);
    }

    @GetMapping
    public List<OwnerDTO> getAllOwners() {

        return ownerService.getAllOwners();
    }

    @GetMapping("/{id}")
    public OwnerDTO getOwnerById(
            @PathVariable Long id) {

        return ownerService.getOwnerById(id);
    }

    @PutMapping("/{id}")
    public OwnerDTO updateOwner(
            @PathVariable Long id,
            @Valid @RequestBody OwnerRequestDTO request) {

        return ownerService.updateOwner(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteOwner(
            @PathVariable Long id) {

        ownerService.deleteOwner(id);

        return "Owner deleted successfully";
    }

    @GetMapping("/{id}/with-units")
    public OwnerWithUnitsDTO getOwnerWithUnits(
            @PathVariable Long id) {

        return ownerService.getOwnerWithUnits(id);
    }
}