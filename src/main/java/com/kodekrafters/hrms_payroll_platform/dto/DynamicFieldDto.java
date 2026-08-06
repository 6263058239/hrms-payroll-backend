package com.kodekrafters.hrms_payroll_platform.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DynamicFieldDto {
    @JsonProperty("fieldLabel")
    private String fieldLabel;

    @JsonProperty("fieldKey")
    private String fieldKey;

    @JsonProperty("fieldCategory")
    private String fieldCategory;

    @JsonProperty("dataType")
    private String dataType;

    @JsonProperty("isRequired")
    private Boolean isRequired;

    @JsonProperty("defaultValue")
    private String defaultValue;

    @JsonProperty("status")
    private String status;
}
