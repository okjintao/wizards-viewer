import { makeStyles, Paper, Typography } from '@material-ui/core';
import { useContext } from 'react';
import { WizardData } from '../interface/wizard-data.interface';
import store from '../store/RootStore';
import { StoreContext } from '../store/StoreContext';
import { getRarityDescriptor, viewerTheme } from '../viewer.utils';

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
  searchCursor: {
    cursor: 'pointer',
  },
}));

interface TraitProps {
  trait: string;
  descriptor: string;
  typeDisplay: string;
  name: string;
  occurrence: number;
}

export interface WizardTraitProps {
  wizard: WizardData;
  affinity: string;
}

function WizardTrait(props: TraitProps): JSX.Element {
  const classes = useStyles(viewerTheme);
  const store = useContext(StoreContext);
  const { descriptor, typeDisplay, name, occurrence, trait } = props;
  const { ranks } = store;
  return (
    <div className={classes.traitContainer}>
      <Typography variant="caption">{`${descriptor} ${typeDisplay}`}</Typography>
      <Typography variant="body1" onClick={() => ranks.search(trait)} className={classes.searchCursor}>
        {name}
      </Typography>
      <Typography variant="caption">{`${occurrence} of 10,000`}</Typography>
    </div>
  );
}

export default function WizardTraits(props: WizardTraitProps): JSX.Element {
  const classes = useStyles(viewerTheme);
  const { wizard, affinity } = props;
  const { ranks } = store;
  const affinityRarity = ranks.getAffinityRarity(affinity);
  const affinityOccurrence = ranks.getAffinityOccurence(affinity);
  return (
    <Paper className={classes.traitsPaper}>
      <WizardTrait
        descriptor={getRarityDescriptor(affinityRarity)}
        typeDisplay={'Affinity'}
        occurrence={affinityOccurrence}
        name={affinity}
        trait={`${affinity} affinity`}
      />
      {wizard.traits.map((trait, j) => {
        const [type, name] = trait.split(': ');
        const typeDisplay = type.charAt(0).toUpperCase() + type.slice(1);
        const occurrence = ranks.getRarityOccurence(trait);
        const rarity = ranks.getRarity(trait);
        const descriptor = getRarityDescriptor(rarity);
        return (
          <WizardTrait
            key={`${name}-${j}`}
            descriptor={descriptor}
            typeDisplay={typeDisplay}
            occurrence={occurrence}
            name={name}
            trait={trait}
          />
        );
      })}
    </Paper>
  );
}
