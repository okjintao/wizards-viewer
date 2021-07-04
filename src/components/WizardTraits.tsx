import { makeStyles, Paper, Typography } from '@material-ui/core';
import { store } from '../Viewer';
import { getRarityDescriptor, viewerTheme } from '../viewer.utils';
import { WizardListItemProps } from './WizardListItem';

const useStyles = makeStyles((theme) => ({
  traitsPaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    backgroundColor: '#5c64ac',
    display: 'flex',
    justifyContent: 'space-around',
  },
  traitContainer: {
    textAlign: 'center',
  },
}));

export default function WizardTraits(props: WizardListItemProps): JSX.Element {
  const classes = useStyles(viewerTheme);
  const { wizard } = props;
  const { ranks } = store;
  return (
    <Paper className={classes.traitsPaper}>
      {wizard.traits.map((trait, j) => {
        const [type, name] = trait.split(': ');
        const typeDisplay = type.charAt(0).toUpperCase() + type.slice(1);
        const occurence = ranks.getRarityOccurence(trait);
        const rarity = ranks.getRarity(trait);
        const descriptor = getRarityDescriptor(rarity);
        return (
          <div key={`${name}-${j}`} className={classes.traitContainer}>
            <Typography variant="caption">{`${descriptor} ${typeDisplay}`}</Typography>
            <Typography variant="body1">{name}</Typography>
            <Typography variant="caption">{`${occurence} of 10,000`}</Typography>
          </div>
        );
      })}
    </Paper>
  );
}
