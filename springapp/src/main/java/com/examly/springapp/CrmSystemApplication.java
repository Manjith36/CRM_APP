package com.examly.springapp;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrmSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrmSystemApplication.class, args);
		connect();
	}
	public static void connect() {
		String url="jdbc:mysql://localhost:3306/appdev";
		String user="root";
		String pass="Mjth2k6S";
		try (Connection conn = DriverManager.getConnection(url, user, pass)){
			if(conn!=null) {
				System.out.println("Successful");
			}
		} catch (SQLException e) {
			System.out.println("Unsuccessful"+e.getMessage());
		}
				
	}
}
