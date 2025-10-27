package com.examly.springapp.service;

import com.examly.springapp.model.Customer;
import com.examly.springapp.repository.CustomerRepository;
import com.examly.springapp.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private InteractionRepository interactionRepository;
    
    public Customer createCustomer(Customer customer) {
        if (customer.getEmail() == null || !customer.getEmail().contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new IllegalArgumentException("Customer with this email already exists");
        }
        
        customer.setRegistrationDate(LocalDate.now());
        return customerRepository.save(customer);
    }
    
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    public Page<Customer> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }
    
    public Page<Customer> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }
    
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }
    
    @Transactional
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new IllegalArgumentException("Customer not found");
        }
        // Delete all interactions for this customer first
        interactionRepository.deleteByCustomerId(id);
        // Then delete the customer
        customerRepository.deleteById(id);
    }
}