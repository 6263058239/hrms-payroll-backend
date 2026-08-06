package com.kodekrafters.hrms_payroll_platform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dynamic_field_configs")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DynamicFieldConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "field_label", nullable = false)
    private String fieldLabel;

    @Column(name = "field_key",nullable = false,unique = true)
    private String fieldKey;

    @Column(name = "field_category", nullable = false)
    private String fieldCategory;

    @Column(name = "data_type", nullable = false)
    private String dataType;

    @Column(name = "is_required")
    private Boolean isRequired = false;

    @Column(name = "default_value")
    private String defaultValue;

    @Column(name = "status")
    private String status = "ACTIVE";
}
