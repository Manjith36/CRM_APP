package com.examly.springapp.controller;

import com.examly.springapp.model.Customer;
import com.examly.springapp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:8082")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/addCustomer")
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        try {
            System.out.println("Creating customer: " + customer.getFirstName() + " " + customer.getLastName());
            Customer saved = customerService.createCustomer(customer);
            System.out.println("Customer created with ID: " + saved.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            System.err.println("Error creating customer: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/getAllCustomers")
    public ResponseEntity<?> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Customer> customerPage = customerService.getAllCustomers(pageable);
            System.out.println("Total customers found: " + customerPage.getTotalElements());
            return ResponseEntity.ok(Map.of(
                "customers", customerPage.getContent(),
                "totalPages", customerPage.getTotalPages(),
                "totalElements", customerPage.getTotalElements(),
                "currentPage", customerPage.getNumber()
            ));
        } catch (Exception e) {
            System.err.println("Error fetching customers: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error fetching customers: " + e.getMessage()));
        }
    }

    @GetMapping("/getAllCustomersSimple")
    public ResponseEntity<List<Customer>> getAllCustomersSimple() {
        List<Customer> customers = customerService.getAllCustomers();
        System.out.println("Simple endpoint - Total customers: " + customers.size());
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/getCustomer/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id)
            .<ResponseEntity<?>>map(customer -> ResponseEntity.ok().body(customer))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Customer not found")));
    }
    
    @DeleteMapping("/deleteCustomer/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }
}