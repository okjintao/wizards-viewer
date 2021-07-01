import {
  Avatar,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Pagination } from '@material-ui/lab';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { store } from '../Viewer';
import { getRarityDescriptor, viewerTheme } from '../viewer.utils';

const useStyles = makeStyles((theme) => ({
  wizardListItem: {
    backgroundColor: theme.palette.background.paper,
    justifyContent: 'space-between',
  },
  wizardListContainer: {
    marginBottom: theme.spacing(4),
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  traitsPaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    backgroundColor: '#5c64ac',
    display: 'flex',
    justifyContent: 'space-around',
  },
  rank: {
    marginRight: theme.spacing(2),
  },
  traitContainer: {
    textAlign: 'center',
  },
  baseContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  wizardContainer: {
    minWidth: '100px',
  },
  infoContainer: {
    minWidth: '500px',
  },
}));

const WizardList = observer(() => {
  const classes = useStyles(viewerTheme);
  const { ranks } = store;

  const pageSize = 8;
  const [page, setPage] = useState(0);
  const start = page * pageSize;
  const end = (page + 1) * pageSize;

  const [expanded, setExpanded] = useState<number | undefined>();

  const baseUrl = 'https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/';
  if (ranks.isSorting) {
    return null;
  }

  return (
    <div className={classes.wizardListContainer}>
      <List dense>
        {ranks.ranking.slice(start, end).map((data, i) => {
          const rank = page * pageSize + i + 1;
          const traitCountRarity = getRarityDescriptor(ranks.getCountRarity(data.traitCount));
          const nameRarity = getRarityDescriptor(ranks.getCountRarity(data.nameLength));
          const rarestTrait = data.traits[0];
          const rarestTraitName = rarestTrait.split(': ')[1];
          const rarestTraitRarity = getRarityDescriptor(ranks.getRarity(rarestTrait));
          return (
            <>
              <ListItem
                key={i}
                dense
                divider
                button
                component={Paper}
                className={classes.wizardListItem}
                onClick={() => setExpanded(expanded !== rank ? rank : undefined)}
              >
                <div className={clsx(classes.baseContainer, classes.wizardContainer)}>
                  <ListItemText primary={`${rank}.`} className={classes.rank} />
                  <ListItemAvatar>
                    <Avatar alt={`${data.name} Avatar`} src={data.image} />
                  </ListItemAvatar>
                  <ListItemText primary={data.name} secondary={`Serial: ${data.id}`} />
                </div>
                <div className={clsx(classes.baseContainer, classes.infoContainer)}>
                  <ListItemText primary={`${rarestTraitRarity} Rarest Trait`} secondary={`${rarestTraitName}`} />
                  <ListItemText primary={`${traitCountRarity} Trait Count`} secondary={`${data.traitCount} traits`} />
                  <ListItemText primary={`${nameRarity} Name`} secondary={`${data.nameLength} part name`} />
                  <ListItemAvatar>
                    <IconButton onClick={() => window.open(`${baseUrl}${data.id}`)}>
                      <ExitToAppIcon />
                    </IconButton>
                  </ListItemAvatar>
                </div>
              </ListItem>
              <Collapse in={expanded === rank} unmountOnExit>
                <Paper className={classes.traitsPaper}>
                  {data.traits.map((trait) => {
                    const [type, name] = trait.split(': ');
                    const typeDisplay = type.charAt(0).toUpperCase() + type.slice(1);
                    const occurence = ranks.getRarityOccurence(trait);
                    const rarity = ranks.getRarity(trait);
                    const descriptor = getRarityDescriptor(rarity);
                    return (
                      <div key={name} className={classes.traitContainer}>
                        <Typography variant="body1">{`${descriptor} ${typeDisplay}`}</Typography>
                        <Typography variant="body2">{name}</Typography>
                        <Typography variant="caption">{`${occurence} of 10,000`}</Typography>
                      </div>
                    );
                  })}
                </Paper>
              </Collapse>
            </>
          );
        })}
      </List>
      <div className={classes.paginationContainer}>
        <Pagination count={ranks.ranking.length / pageSize} onChange={(_e, page) => setPage(page - 1)} />
      </div>
    </div>
  );
});

export default WizardList;
