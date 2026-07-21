package com.github.rodrigokuerten.finance_dashboard.service;

import com.github.rodrigokuerten.finance_dashboard.dto.CreateEmployeeRequest;
import com.github.rodrigokuerten.finance_dashboard.entity.Employee;
import com.github.rodrigokuerten.finance_dashboard.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }

    public ResponseEntity<Employee> createEmployee(CreateEmployeeRequest request) {
        Employee employee = mapRequestToEmployee(request, new Employee());
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeRepository.save(employee));
    }

    public ResponseEntity<Employee> updateEmployee(Long id, CreateEmployeeRequest request) {
        return employeeRepository.findById(id)
                .map(existing -> ResponseEntity.ok(employeeRepository.save(mapRequestToEmployee(request, existing))))
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Void> deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        employeeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Employee mapRequestToEmployee(CreateEmployeeRequest request, Employee employee) {
        employee.setName(request.getName());
        employee.setCpf(request.getCpf());
        employee.setRg(request.getRg());
        employee.setBirthDate(request.getBirthDate());
        employee.setPhone(request.getPhone());
        employee.setEmail(request.getEmail());
        employee.setAddress(request.getAddress());
        employee.setRole(request.getRole());
        employee.setDepartment(request.getDepartment());
        employee.setAdmissionDate(request.getAdmissionDate());
        employee.setContractType(request.getContractType());
        employee.setSalary(request.getSalary());
        employee.setWorkHoursPerWeek(request.getWorkHoursPerWeek());
        employee.setStatus(request.getStatus());
        return employee;
    }
}
