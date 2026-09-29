package com.ulpin.spring_registry.service;

import com.ulpin.spring_registry.dto.GeometryDTO;
import com.ulpin.spring_registry.dto.ParcelDTO;
import com.ulpin.spring_registry.dto.ParcelRequestDTO;
import com.ulpin.spring_registry.dto.ParcelWithBuildingsDTO;
import com.ulpin.spring_registry.dto.BuildingDTO;

import com.ulpin.spring_registry.entity.Parcel;
import com.ulpin.spring_registry.entity.Building;

import com.ulpin.spring_registry.exception.ResourceNotFoundException;

import com.ulpin.spring_registry.repository.ParcelRepository;
import com.ulpin.spring_registry.repository.BuildingRepository;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParcelService {

    private final ParcelRepository parcelRepository;
    private final BuildingRepository buildingRepository;

    private final GeometryFactory geometryFactory =
            new GeometryFactory();


    public ParcelService(
            ParcelRepository parcelRepository,
            BuildingRepository buildingRepository) {

        this.parcelRepository = parcelRepository;
        this.buildingRepository = buildingRepository;
    }


    // =========================================================
    // CREATE PARCEL
    // =========================================================

    public ParcelDTO saveParcel(
            ParcelRequestDTO request) {

        // Check duplicate parcel number
        boolean duplicate =
                parcelRepository.existsByParcelNumberIgnoreCase(
                        request.getParcelNumber()
                );

        if (duplicate) {

            throw new IllegalArgumentException(
                    "Parcel number already exists"
            );
        }


        Parcel parcel = new Parcel();

        parcel.setParcelNumber(
                request.getParcelNumber()
        );

        parcel.setAddress(
                request.getAddress()
        );

        parcel.setDistrict(
                request.getDistrict()
        );

        parcel.setState(
                request.getState()
        );

        parcel.setArea(
                request.getArea()
        );

        parcel.setLandType(
                request.getLandType()
        );


        // Create and validate geometry
        if (request.getGeometry() != null) {

            parcel.setGeometry(
                    validateAndCreateGeometry(
                            request.getGeometry()
                    )
            );
        }


        Parcel savedParcel =
                parcelRepository.save(parcel);


        return convertToDTO(savedParcel);
    }


    // =========================================================
    // GET ALL PARCELS
    // =========================================================

    public List<ParcelDTO> getAllParcels() {

        return parcelRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET PARCEL BY ID
    // =========================================================

    public ParcelDTO getParcelById(
            Long id) {

        Parcel parcel =
                parcelRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Parcel not found with id: "
                                                + id
                                ));

        return convertToDTO(parcel);
    }


    // =========================================================
    // DELETE PARCEL
    // =========================================================

    public void deleteParcel(
            Long id) {

        Parcel parcel =
                parcelRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Parcel not found with id: "
                                                + id
                                ));


        // Check whether buildings are associated
        List<Building> buildings =
                buildingRepository.findByParcelId(id);


        if (!buildings.isEmpty()) {

            throw new IllegalArgumentException(
                    "Cannot delete parcel because buildings are still associated with it"
            );
        }


        parcelRepository.delete(parcel);
    }


    // =========================================================
    // UPDATE PARCEL
    // =========================================================

    public ParcelDTO updateParcel(
            Long id,
            ParcelRequestDTO request) {

        Parcel parcel =
                parcelRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Parcel not found with id: "
                                                + id
                                ));


        // Check duplicate parcel number
        // while excluding current parcel
        boolean duplicate =
                parcelRepository
                        .existsByParcelNumberIgnoreCaseAndIdNot(
                                request.getParcelNumber(),
                                id
                        );


        if (duplicate) {

            throw new IllegalArgumentException(
                    "Parcel number already exists"
            );
        }


        parcel.setParcelNumber(
                request.getParcelNumber()
        );

        parcel.setAddress(
                request.getAddress()
        );

        parcel.setDistrict(
                request.getDistrict()
        );

        parcel.setState(
                request.getState()
        );

        parcel.setArea(
                request.getArea()
        );

        parcel.setLandType(
                request.getLandType()
        );


        // Update geometry
        if (request.getGeometry() != null) {

            parcel.setGeometry(
                    validateAndCreateGeometry(
                            request.getGeometry()
                    )
            );
        }


        Parcel updatedParcel =
                parcelRepository.save(parcel);


        return convertToDTO(updatedParcel);
    }


    // =========================================================
    // FIND INTERSECTING PARCELS
    // =========================================================

    public List<ParcelDTO> findIntersectingParcels(
            GeometryDTO geometry) {

        Polygon polygon =
                validateAndCreateGeometry(geometry);


        String wkt =
                polygon.toText();


        List<Parcel> parcels =
                parcelRepository.findParcelsIntersecting(
                        wkt
                );


        return parcels.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // FIND CONTAINED PARCELS
    // =========================================================

    public List<ParcelDTO> findContainedParcels(
            GeometryDTO geometry) {

        Polygon polygon =
                validateAndCreateGeometry(geometry);


        String wkt =
                polygon.toText();


        List<Parcel> parcels =
                parcelRepository.findParcelsContainedBy(
                        wkt
                );


        return parcels.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // FIND PARCELS WITHIN DISTANCE
    // =========================================================

    public List<ParcelDTO> findParcelsWithinDistance(
            Double longitude,
            Double latitude,
            Double distance) {

        if (longitude == null ||
                latitude == null ||
                distance == null) {

            throw new IllegalArgumentException(
                    "Longitude, latitude and distance are required"
            );
        }


        if (longitude < -180 ||
                longitude > 180) {

            throw new IllegalArgumentException(
                    "Longitude must be between -180 and 180"
            );
        }


        if (latitude < -90 ||
                latitude > 90) {

            throw new IllegalArgumentException(
                    "Latitude must be between -90 and 90"
            );
        }


        if (distance < 0) {

            throw new IllegalArgumentException(
                    "Distance cannot be negative"
            );
        }


        List<Parcel> parcels =
                parcelRepository.findParcelsWithinDistance(
                        longitude,
                        latitude,
                        distance
                );


        return parcels.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // SEARCH PARCELS BY ATTRIBUTES
    // =========================================================

    public List<ParcelDTO> searchParcels(
            String district,
            String state,
            String landType) {

        List<Parcel> parcels =
                parcelRepository.searchParcels(
                        district,
                        state,
                        landType
                );


        return parcels.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // FIND PARCELS BY PARCEL NUMBER
    // =========================================================

    public List<ParcelDTO> findParcelsByNumber(
            String parcelNumber) {

        List<Parcel> parcels =
                parcelRepository.findByParcelNumberIgnoreCase(
                        parcelNumber
                );


        return parcels.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET PARCEL WITH ALL BUILDINGS
    // =========================================================

    public ParcelWithBuildingsDTO getParcelWithBuildings(
            Long parcelId) {

        Parcel parcel =
                parcelRepository.findById(parcelId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Parcel not found with id: "
                                                + parcelId
                                ));


        List<Building> buildings =
                buildingRepository.findByParcelId(
                        parcelId
                );


        List<BuildingDTO> buildingDTOs =
                buildings.stream()
                        .map(this::convertBuildingToDTO)
                        .collect(Collectors.toList());


        ParcelWithBuildingsDTO dto =
                new ParcelWithBuildingsDTO();


        dto.setId(
                parcel.getId()
        );

        dto.setParcelNumber(
                parcel.getParcelNumber()
        );

        dto.setAddress(
                parcel.getAddress()
        );

        dto.setDistrict(
                parcel.getDistrict()
        );

        dto.setState(
                parcel.getState()
        );

        dto.setArea(
                parcel.getArea()
        );

        dto.setLandType(
                parcel.getLandType()
        );

        dto.setBuildings(
                buildingDTOs
        );


        return dto;
    }


    // =========================================================
    // GEOMETRY VALIDATION
    // =========================================================

    private Polygon validateAndCreateGeometry(
            GeometryDTO geometryDTO) {

        if (geometryDTO == null) {

            throw new IllegalArgumentException(
                    "Geometry cannot be null"
            );
        }


        if (geometryDTO.getType() == null ||
                !"Polygon".equalsIgnoreCase(
                        geometryDTO.getType())) {

            throw new IllegalArgumentException(
                    "Only Polygon geometry is supported"
            );
        }


        List<List<List<Double>>> coordinates =
                geometryDTO.getCoordinates();


        if (coordinates == null ||
                coordinates.isEmpty()) {

            throw new IllegalArgumentException(
                    "Polygon coordinates cannot be empty"
            );
        }


        List<List<Double>> ring =
                coordinates.get(0);


        if (ring == null ||
                ring.size() < 4) {

            throw new IllegalArgumentException(
                    "Polygon must contain at least 4 coordinates"
            );
        }


        // Check first and last coordinate
        // are the same
        List<Double> first =
                ring.get(0);

        List<Double> last =
                ring.get(ring.size() - 1);


        if (!first.equals(last)) {

            throw new IllegalArgumentException(
                    "Polygon must be closed: first and last coordinates must be the same"
            );
        }


        Coordinate[] jtsCoordinates =
                new Coordinate[ring.size()];


        for (int i = 0;
             i < ring.size();
             i++) {

            List<Double> point =
                    ring.get(i);


            if (point == null ||
                    point.size() < 2) {

                throw new IllegalArgumentException(
                        "Each coordinate must contain longitude and latitude"
                );
            }


            Double longitude =
                    point.get(0);

            Double latitude =
                    point.get(1);


            if (longitude == null ||
                    latitude == null) {

                throw new IllegalArgumentException(
                        "Longitude and latitude cannot be null"
                );
            }


            if (longitude < -180 ||
                    longitude > 180) {

                throw new IllegalArgumentException(
                        "Longitude must be between -180 and 180"
                );
            }


            if (latitude < -90 ||
                    latitude > 90) {

                throw new IllegalArgumentException(
                        "Latitude must be between -90 and 90"
                );
            }


            jtsCoordinates[i] =
                    new Coordinate(
                            longitude,
                            latitude
                    );
        }


        Polygon polygon =
                geometryFactory.createPolygon(
                        jtsCoordinates
                );


        // Set SRID to WGS 84
        polygon.setSRID(4326);


        // Check JTS geometry validity
        if (!polygon.isValid()) {

            throw new IllegalArgumentException(
                    "Invalid polygon geometry"
            );
        }


        return polygon;
    }


    // =========================================================
    // CONVERT PARCEL ENTITY TO DTO
    // =========================================================

    private ParcelDTO convertToDTO(
            Parcel parcel) {

        ParcelDTO dto =
                new ParcelDTO();


        dto.setId(
                parcel.getId()
        );

        dto.setParcelNumber(
                parcel.getParcelNumber()
        );

        dto.setAddress(
                parcel.getAddress()
        );

        dto.setDistrict(
                parcel.getDistrict()
        );

        dto.setState(
                parcel.getState()
        );

        dto.setArea(
                parcel.getArea()
        );

        dto.setLandType(
                parcel.getLandType()
        );


        // Convert geometry
        if (parcel.getGeometry() != null) {

            GeometryDTO geometryDTO =
                    new GeometryDTO();

            geometryDTO.setType(
                    "Polygon"
            );


            Polygon polygon =
                    (Polygon) parcel.getGeometry();


            org.locationtech.jts.geom.Coordinate[] coordinates =
                    polygon.getCoordinates();


            List<List<Double>> ring =
                    java.util.Arrays.stream(
                                    coordinates
                            )
                            .map(coordinate ->
                                    List.of(
                                            coordinate.getX(),
                                            coordinate.getY()
                                    )
                            )
                            .collect(Collectors.toList());


            List<List<List<Double>>> polygonCoordinates =
                    List.of(ring);


            geometryDTO.setCoordinates(
                    polygonCoordinates
            );


            dto.setGeometry(
                    geometryDTO
            );
        }


        return dto;
    }


    // =========================================================
    // CONVERT BUILDING ENTITY TO DTO
    // =========================================================

    private BuildingDTO convertBuildingToDTO(
            Building building) {

        BuildingDTO dto =
                new BuildingDTO();


        dto.setId(
                building.getId()
        );

        dto.setBuildingNumber(
                building.getBuildingNumber()
        );

        dto.setName(
                building.getName()
        );

        dto.setBuildingType(
                building.getBuildingType()
        );

        dto.setNumberOfFloors(
                building.getNumberOfFloors()
        );


        if (building.getParcel() != null) {

            dto.setParcelId(
                    building.getParcel().getId()
            );
        }


        return dto;
    }
}