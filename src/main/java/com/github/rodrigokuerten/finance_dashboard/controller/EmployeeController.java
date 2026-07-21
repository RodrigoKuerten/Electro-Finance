package com.github.rodrigokuerten.finance_dashboard.controller;

import com.github.rodrigokuerten.finance_dashboard.dto.CreateEmployeeRequest;
import com.github.rodrigokuerten.finance_dashboard.entity.Employee;
import com.github.rodrigokuerten.finance_dashboard.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/get-all-employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @PostMapping("/create-employee")
    public ResponseEntity<Employee> createEmployee(@RequestBody CreateEmployeeRequest request) {
        return employeeService.createEmployee(request);
    }

    @PutMapping("/update-employee-{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody CreateEmployeeRequest request) {
        return employeeService.updateEmployee(id, request);
    }

    @DeleteMapping("/delete-employee-{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        return employeeService.deleteEmployee(id);
    }
}
