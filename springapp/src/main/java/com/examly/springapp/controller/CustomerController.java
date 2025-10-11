package com.examly.springapp.controller;

import com.examly.springapp.model.Customer;
import com.examly.springapp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        if (customer.getEmail() == null || !customer.getEmail().contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email format"));
        }
        
        if (customerRepository.existsByEmail(customer.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Customer with this email already exists"));
        }
        
        customer.setRegistrationDate(LocalDate.now());
        Customer saved = customerRepository.save(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        return customerRepository.findById(id)
            .<ResponseEntity<?>>map(customer -> ResponseEntity.ok().body(customer))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Customer not found")));
    }
}