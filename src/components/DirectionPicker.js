import React from "react";
import _ from 'lodash';
import { Radio, RadioGroup } from "@material-ui/core";
import { FormControl, FormControlLabel, FormLabel} from "@material-ui/core";

const DirectionPicker = ({ directions, direction, handleChange, endpoints, asRow }) => {

  return (
    <FormControl component="fieldset" required>
      <FormLabel component="legend">Bus direction</FormLabel>      
      <RadioGroup name="directions" value={direction} row={asRow}>
        {directions.map((s, i) => (
          <FormControlLabel
            key={s}
            value={s}
            control={<Radio />}
            style={{textDecoration: direction === s ? 'dotted underline' : 'none'}}
            onChange={() => handleChange(s)}
            label={`${_.capitalize(s)}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default DirectionPicker;
