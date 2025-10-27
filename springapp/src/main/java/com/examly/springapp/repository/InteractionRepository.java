package com.examly.springapp.repository;

import com.examly.springapp.model.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    List<Interaction> findByCustomerId(Long customerId);
    void deleteByCustomerId(Long customerId);
}