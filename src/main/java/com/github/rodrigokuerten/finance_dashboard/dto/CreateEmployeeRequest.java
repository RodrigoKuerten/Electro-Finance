package com.github.rodrigokuerten.finance_dashboard.dto;

import com.github.rodrigokuerten.finance_dashboard.enums.ContractTypeEnum;
import com.github.rodrigokuerten.finance_dashboard.enums.DepartmentEnum;
import com.github.rodrigokuerten.finance_dashboard.enums.EmployeeStatusEnum;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateEmployeeRequest {

    private String name;
    private String cpf;
    private String rg;
    private LocalDate birthDate;
    private String phone;
    private String email;
    private String address;
    private String role;
    private DepartmentEnum department;
    private LocalDate admissionDate;
    private ContractTypeEnum contractType;
    private BigDecimal salary;
    private Integer workHoursPerWeek;
    private EmployeeStatusEnum status;
}
