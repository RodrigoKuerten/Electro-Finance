package com.github.rodrigokuerten.finance_dashboard.repository;

import com.github.rodrigokuerten.finance_dashboard.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
