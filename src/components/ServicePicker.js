import { FormControl, FormControlLabel, FormLabel } from "@material-ui/core";
import { Radio, RadioGroup } from "@material-ui/core";

import React from "react";

const ServicePicker = ({ services, service, handleChange, asRow = false }) => {
  let svcLookup = ["Weekday", "Saturday", "Sunday"];

  return (
    <FormControl component="fieldset" required>
      <FormLabel component="legend">Service day</FormLabel>
      <RadioGroup name="services" value={service} row={asRow}>
        {services.sort().map((s, i) => (
          <FormControlLabel
            key={s}
            value={s}
            control={<Radio />}
            style={{ textDecoration: service === s ? "dotted underline" : "none" }}
            onChange={() => handleChange(s)}
            label={svcLookup[s - 1]}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default ServicePicker;
