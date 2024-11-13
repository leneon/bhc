package com.example.Atiko.repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Atiko.entities.Service;

public interface ServiceRepository extends  JpaRepository<Service, Long>{
    
}
