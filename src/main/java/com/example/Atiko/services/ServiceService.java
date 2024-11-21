package com.example.Atiko.services;

import com.example.Atiko.dtos.ServiceDto;
import com.example.Atiko.entities.Service;
import com.example.Atiko.repositories.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    // Convert service to serviceDto
    private ServiceDto convertToDto(Service service) {
        return new ServiceDto(service);
    }

    // Convert serviceDto to service
    private Service convertToEntity(ServiceDto dto) {
        Service service = new Service();
        service.setId(dto.getId());
        service.setNom(dto.getNom());
        service.setDescription(dto.getDescription());
        service.setType(dto.getType());
        return service;
    }

    public List<ServiceDto> getAllservices() {
        return serviceRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
 
    public Optional<ServiceDto> getServiceById(Long id) {
        return serviceRepository.findById(id).map(this::convertToDto);
    }

    public ServiceDto createservice(ServiceDto serviceDto) {
        Service service = convertToEntity(serviceDto);
        Service savedservice = serviceRepository.save(service);
        return convertToDto(savedservice);
    }

    public Optional<ServiceDto> updateservice(Long id, ServiceDto serviceDto) {
        return serviceRepository.findById(id).map(existingservice -> {
            existingservice.setNom(serviceDto.getNom());
            existingservice.setDescription(serviceDto.getDescription());
            existingservice.setType(serviceDto.getType());
            return convertToDto(serviceRepository.save(existingservice));
        });
    }

    public void deleteservice(Long id) {
        serviceRepository.deleteById(id);
    }
}
