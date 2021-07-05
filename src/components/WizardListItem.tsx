import {
  Avatar,
  Collapse,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { baseUrl, ref } from '../config/constants';
import { WizardData } from '../interface/wizard-data.interface';
import store from '../store/RootStore';
import { getRarityDescriptor } from '../viewer.utils';
import WizardTraits from './WizardTraits';

const useStyles = makeStyles((theme) => ({
  wizardListItem: {
    backgroundColor: '#859d92',
    justifyContent: 'space-between',
  },
  wizardListContainer: {
    marginBottom: theme.spacing(4),
  },
  rank: {
    marginRight: theme.spacing(2),
  },
  baseContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  wizardContainer: {
    minWidth: '100px',
  },
  infoItem: {
    minWidth: '155px',
  },
}));

export interface WizardListItemProps {
  wizard: WizardData;
}

const WizardListItem = observer((props: WizardListItemProps): JSX.Element => {
  const classes = useStyles();
  const { ranks, info } = store;
  const { wizard } = props;
  const { rank } = wizard;
  const traitCountRarity = getRarityDescriptor(ranks.getCountRarity(wizard.traitCount));
  const nameRarity = getRarityDescriptor(ranks.getCountRarity(wizard.nameLength));
  const rarestTrait = wizard.traits[0];
  const rarestTraitName = rarestTrait.split(': ')[1];
  const rarestTraitRarity = getRarityDescriptor(ranks.getRarity(rarestTrait));
  return (
    <>
      <ListItem
        dense
        divider
        button
        component={Paper}
        className={classes.wizardListItem}
        onClick={() => info.setExpanded(rank)}
      >
        <div className={clsx(classes.baseContainer, classes.wizardContainer)}>
          <ListItemText primary={`${rank}.`} className={classes.rank} />
          <ListItemAvatar>
            <Avatar alt={`${wizard.name} Avatar`} src={wizard.image} />
          </ListItemAvatar>
          <ListItemText primary={wizard.name} secondary={`Serial: ${wizard.id}`} />
        </div>
        <div className={classes.baseContainer}>
          <ListItemText
            primary={`${rarestTraitRarity} Trait`}
            secondary={`${rarestTraitName}`}
            className={classes.infoItem}
          />
          <ListItemText
            primary={`${traitCountRarity} Trait Count`}
            secondary={`${wizard.traitCount} traits`}
            className={classes.infoItem}
          />
          <ListItemText
            primary={`${nameRarity} Name`}
            secondary={`${wizard.nameLength} part name`}
            className={classes.infoItem}
          />
          <ListItemAvatar>
            <IconButton onClick={() => window.open(`${baseUrl}${wizard.id}${ref}`)}>
              <ExitToAppIcon />
            </IconButton>
          </ListItemAvatar>
        </div>
      </ListItem>
      <Collapse key={`collapse-${wizard.rank}`} in={info.expanded === rank} unmountOnExit>
        <WizardTraits wizard={wizard} />
      </Collapse>
    </>
  );
});

export default WizardListItem;
