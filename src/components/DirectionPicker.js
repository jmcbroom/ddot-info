import React from "react";
import { Radio, RadioGroup } from "@material-ui/core";
import { FormControl, FormControlLabel } from "@material-ui/core";

const DirectionPicker = ({ directions, direction, handleChange, endpoints }) => {

  return (
    <FormControl component="fieldset" required>
      <RadioGroup name="directions" value={direction}>
        {directions.map((s, i) => (
          <FormControlLabel
            key={s}
            value={s}
            control={<Radio />}
            onChange={() => handleChange(s)}
            label={window.innerWidth > 650 ? `${s} to ${endpoints[i]}` : `${direction}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default DirectionPicker;
