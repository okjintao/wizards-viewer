import { Checkbox, FormControlLabel, makeStyles, Paper } from '@material-ui/core';
import store from '../store/RootStore';
import { viewerTheme } from '../viewer.utils';

const useStyles = makeStyles((theme) => ({
  filterPaper: {
    padding: theme.spacing(1, 3),
    backgroundColor: '#5c64ac',
    display: 'flex',
  },
}));

export default function WizardFilterOptions(): JSX.Element | null {
  const classes = useStyles(viewerTheme);
  const { ranks } = store;
  return (
    <Paper className={classes.filterPaper}>
      <FormControlLabel
        control={<Checkbox onClick={ranks.toggleIncludeCount} name="includeTraitCount" size="small" />}
        label="Trait Count"
      />
      <FormControlLabel
        control={<Checkbox onClick={ranks.toggleIncludeName} name="includeName" size="small" />}
        label="Name Rarity"
      />
    </Paper>
  );
}
