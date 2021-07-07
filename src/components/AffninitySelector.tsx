import { fade, FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from '../store/StoreContext';
import { viewerTheme } from '../viewer.utils';

const useStyles = makeStyles((theme) => ({
  affinityDropdown: {
    margin: theme.spacing(0),
    width: '225px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  dropdownContainer: {
    display: 'flex',
  },
}));

const AffinitySelector = observer((): JSX.Element => {
  const store = useContext(StoreContext);
  const classes = useStyles(viewerTheme);
  const { ranks, state } = store;
  const { affinityOccurences } = ranks.wizardSummary;
  const affinityOptions = Object.entries(affinityOccurences)
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0]);

  return (
    <div className={classes.dropdownContainer}>
      <FormControl margin="dense" size="small" variant="outlined" className={classes.affinityDropdown}>
        <InputLabel>Affinity Option</InputLabel>
        <Select onChange={(e) => state.setAffinity(Number(e.target.value))}>
          {affinityOptions.map((opt, i) => (
            <MenuItem key={i} value={opt}>
              Affinity {`${opt}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
});

export default AffinitySelector;
