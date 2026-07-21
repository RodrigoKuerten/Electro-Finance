package com.github.rodrigokuerten.finance_dashboard.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.github.rodrigokuerten.finance_dashboard.enums.ContractTypeEnum;
import com.github.rodrigokuerten.finance_dashboard.enums.DepartmentEnum;
import com.github.rodrigokuerten.finance_dashboard.enums.EmployeeStatusEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "EMPLOYEE")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "cpf", unique = true, nullable = false)
    private String cpf;

    @Column(name = "rg")
    private String rg;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "address")
    private String address;

    @Column(name = "role", nullable = false)
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(name = "department", nullable = false, columnDefinition = "VARCHAR(50)")
    private DepartmentEnum department;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false, columnDefinition = "VARCHAR(50)")
    private ContractTypeEnum contractType;

    @Column(name = "salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(name = "work_hours_per_week")
    private Integer workHoursPerWeek;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(50)")
    private EmployeeStatusEnum status;

    @JsonIgnore
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmployeeDocument> documents = new ArrayList<>();

}
