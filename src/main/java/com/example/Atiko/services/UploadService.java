package com.example.Atiko.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Atiko.entities.Upload;
import com.example.Atiko.repositories.UploadRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UploadService {

    @Autowired
    private UploadRepository uploadRepository;

    public List<Upload> findAll() {
        return uploadRepository.findAll();
    }

    public Optional<Upload> findById(Long id) {
        return uploadRepository.findById(id);
    }

    public Upload save(Upload upload) {
        return uploadRepository.save(upload);
    }

    public void deleteById(Long id) {
        uploadRepository.deleteById(id);
    }
}
