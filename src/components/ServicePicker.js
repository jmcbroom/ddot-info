import React from "react";
import { Radio, RadioGroup } from "@material-ui/core";
import { FormControl, FormControlLabel } from "@material-ui/core";

const ServicePicker = ({ services, service, handleChange }) => {

  let svcLookup = ['Weekday', 'Saturday', 'Sunday']

  return (
    <FormControl component="fieldset" required>
      <RadioGroup name="services" value={service}>
        {services.map((s, i) => (
          <FormControlLabel
            key={s}
            value={s}
            control={<Radio />}
            onChange={() => handleChange(s)}
            label={svcLookup[s - 1]}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default ServicePicker;
