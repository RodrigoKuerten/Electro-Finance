package com.github.rodrigokuerten.finance_dashboard.dto;

import com.github.rodrigokuerten.finance_dashboard.entity.Employee;

import java.util.List;

public record EmployeeListResponse(List<Employee> employees) {
}
