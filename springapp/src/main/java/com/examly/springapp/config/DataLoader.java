package com.examly.springapp.config;

import com.examly.springapp.model.Customer;
import com.examly.springapp.model.CustomerType;
import com.examly.springapp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public void run(String... args) throws Exception {
        if (customerRepository.count() == 0) {
            System.out.println("Loading sample customer data...");
            
            Customer customer1 = new Customer();
            customer1.setFirstName("John");
            customer1.setLastName("Doe");
            customer1.setEmail("john.doe@example.com");
            customer1.setPhoneNumber("123-456-7890");
            customer1.setCustomerType(CustomerType.REGULAR);
            customer1.setRegistrationDate(LocalDate.now().minusDays(30));
            customerRepository.save(customer1);

            Customer customer2 = new Customer();
            customer2.setFirstName("Jane");
            customer2.setLastName("Smith");
            customer2.setEmail("jane.smith@example.com");
            customer2.setPhoneNumber("098-765-4321");
            customer2.setCustomerType(CustomerType.PREMIUM);
            customer2.setRegistrationDate(LocalDate.now().minusDays(15));
            customerRepository.save(customer2);

            Customer customer3 = new Customer();
            customer3.setFirstName("Bob");
            customer3.setLastName("Johnson");
            customer3.setEmail("bob.johnson@example.com");
            customer3.setPhoneNumber("555-123-4567");
            customer3.setCustomerType(CustomerType.VIP);
            customer3.setRegistrationDate(LocalDate.now().minusDays(5));
            customerRepository.save(customer3);

            System.out.println("Sample data loaded successfully!");
        }
    }
}