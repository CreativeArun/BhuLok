package com.ulpin.spring_registry.repository;

import com.ulpin.spring_registry.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OwnerRepository
        extends JpaRepository<Owner, Long> {

}