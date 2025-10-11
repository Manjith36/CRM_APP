package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "interactions")
public class Interaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long customerId;

    @Enumerated(EnumType.STRING)
    @NotNull
    private InteractionType interactionType;

    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull
    private InteractionStatus status;

    private LocalDateTime interactionDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public InteractionType getInteractionType() { return interactionType; }
    public void setInteractionType(InteractionType interactionType) { this.interactionType = interactionType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public InteractionStatus getStatus() { return status; }
    public void setStatus(InteractionStatus status) { this.status = status; }

    public LocalDateTime getInteractionDate() { return interactionDate; }
    public void setInteractionDate(LocalDateTime interactionDate) { this.interactionDate = interactionDate; }
}