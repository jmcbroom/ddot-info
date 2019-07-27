import React from "react";
import { Radio, RadioGroup, FormHelperText } from "@material-ui/core";
import { FormControl, FormControlLabel, FormLabel } from "@material-ui/core";

const ServicePicker = ({ services, service, handleChange, asRow=false }) => {

  let svcLookup = ['Weekday', 'Saturday', 'Sunday']

  return (
    <FormControl component="fieldset" required>
      <FormLabel component='legend' >Service</FormLabel>
      <RadioGroup name="services" value={service} row={asRow} style={{marginLeft: `1rem`}}>
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
