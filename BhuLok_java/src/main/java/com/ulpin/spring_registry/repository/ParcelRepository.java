package com.ulpin.spring_registry.repository;

import com.ulpin.spring_registry.entity.Parcel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParcelRepository
        extends JpaRepository<Parcel, Long> {


    // =========================================================
    // SPATIAL INTERSECTION
    // =========================================================

    @Query(value = """
            SELECT *
            FROM parcel
            WHERE ST_Intersects(
                geometry,
                ST_GeomFromText(:wkt, 4326)
            )
            """,
            nativeQuery = true)
    List<Parcel> findParcelsIntersecting(
            @Param("wkt") String wkt
    );


    // =========================================================
    // SPATIAL CONTAINS
    // =========================================================

    @Query(value = """
            SELECT *
            FROM parcel
            WHERE ST_Contains(
                ST_GeomFromText(:wkt, 4326),
                geometry
            )
            """,
            nativeQuery = true)
    List<Parcel> findParcelsContainedBy(
            @Param("wkt") String wkt
    );


    // =========================================================
    // SPATIAL DISTANCE
    // =========================================================

    @Query(value = """
            SELECT *
            FROM parcel
            WHERE ST_DWithin(
                geometry::geography,
                ST_SetSRID(
                    ST_MakePoint(:longitude, :latitude),
                    4326
                )::geography,
                :distance
            )
            """,
            nativeQuery = true)
    List<Parcel> findParcelsWithinDistance(
            @Param("longitude") Double longitude,
            @Param("latitude") Double latitude,
            @Param("distance") Double distance
    );


    // =========================================================
    // SEARCH PARCELS BY ATTRIBUTES
    // =========================================================

    @Query("""
            SELECT p
            FROM Parcel p
            WHERE LOWER(p.district) = LOWER(:district)
            AND LOWER(p.state) = LOWER(:state)
            AND LOWER(p.landType) = LOWER(:landType)
            """)
    List<Parcel> searchParcels(
            @Param("district") String district,
            @Param("state") String state,
            @Param("landType") String landType
    );


    // =========================================================
    // FIND PARCELS BY PARCEL NUMBER
    // =========================================================

    List<Parcel> findByParcelNumberIgnoreCase(
            String parcelNumber
    );


    // =========================================================
    // CHECK DUPLICATE PARCEL NUMBER
    // =========================================================

    boolean existsByParcelNumberIgnoreCase(
            String parcelNumber
    );


    // =========================================================
    // CHECK DUPLICATE PARCEL NUMBER DURING UPDATE
    // =========================================================

    boolean existsByParcelNumberIgnoreCaseAndIdNot(
            String parcelNumber,
            Long id
    );
}