import { makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { viewerTheme } from '../viewer.utils';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },
  positive: {
    backgroundColor: '#859d92',
  },
}));

export interface AffinityProps {
  id: number;
  identity: boolean;
}

export default function Affinity(props: AffinityProps): JSX.Element {
  const classes = useStyles(viewerTheme);
  const { id, identity } = props;
  return (
    <Paper className={clsx(classes.card, !identity && classes.positive)}>
      <Typography variant="body1" align="center">
        Affinity {id}
      </Typography>
      <Typography variant="caption" align="center">
        {identity ? 'Identity' : 'Positive'}
      </Typography>
    </Paper>
  );
}
