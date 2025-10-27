package com.examly.springapp.service;

import com.examly.springapp.model.Interaction;
import com.examly.springapp.repository.CustomerRepository;
import com.examly.springapp.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InteractionService {
    
    @Autowired
    private InteractionRepository interactionRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public Interaction createInteraction(Interaction interaction) {
        if (!customerRepository.existsById(interaction.getCustomerId())) {
            throw new IllegalArgumentException("Customer not found");
        }
        
        interaction.setInteractionDate(LocalDateTime.now());
        return interactionRepository.save(interaction);
    }
    
    public List<Interaction> getInteractionsByCustomerId(Long customerId) {
        return interactionRepository.findByCustomerId(customerId);
    }
    
    public Interaction updateInteraction(Long id, Interaction interaction) {
        Interaction existing = interactionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Interaction not found"));
        
        existing.setInteractionType(interaction.getInteractionType());
        existing.setDescription(interaction.getDescription());
        existing.setStatus(interaction.getStatus());
        
        return interactionRepository.save(existing);
    }
}