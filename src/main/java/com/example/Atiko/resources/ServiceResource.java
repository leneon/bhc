package com.example.Atiko.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Atiko.dtos.ServiceDto;
import com.example.Atiko.services.ServiceService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
public class ServiceResource{

    @Autowired
    private ServiceService serviceService;

    // Create an service
    @PostMapping
    public ResponseEntity<ServiceDto> createservice(@RequestBody ServiceDto serviceDto){
        ServiceDto createdservice = serviceService.createservice(serviceDto);
        return ResponseEntity.ok(createdservice);
    }

    // Update an service
    @PutMapping("/{id}")
    public ResponseEntity<?> updateservice(@PathVariable Long id, @RequestBody ServiceDto serviceDto){
        return ResponseEntity.ok(serviceService.updateservice(id, serviceDto));
    }
     
    // Get all services
    @GetMapping
    public ResponseEntity<List<ServiceDto>> getAllservices() {
        List<ServiceDto> services = serviceService.getAllservices();
        return ResponseEntity.ok(services);
    }

        // Get all services
        @GetMapping("/{id}")
        public ResponseEntity<?> getServices(@PathVariable Long id) {
            Optional<ServiceDto> services = serviceService.getServiceById(id);
            return ResponseEntity.ok(services);
        }
    


    // Delete an service
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteservice(@PathVariable Long id) {
        serviceService.deleteservice(id);
        return ResponseEntity.noContent().build();
    }
}

