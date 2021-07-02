import {
  AppBar,
  Avatar,
  Button,
  Checkbox,
  fade,
  FormControlLabel,
  InputBase,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { store } from '../Viewer';
import { viewerTheme } from '../viewer.utils';

const useStlyes = makeStyles((theme) => ({
  appBarContainer: {
    marginBottom: theme.spacing(1),
  },
  titleIcon: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    height: '75px',
    width: '75px',
  },
  titleContainer: {
    justifyContent: 'space-between',
    color: '#e1c0b1',
  },
  icon: {
    height: '33px',
    width: '33px',
  },
  baseContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  buttonContainer: {
    justifyContent: 'center',
    display: 'flex',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  toolbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  link: {
    textDecoration: 'none',
    color: '#e0decc',
    cursor: 'pointer',
  },
  accountContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginLeft: theme.spacing(1),
  },
}));

const WizardBar = observer((): JSX.Element | null => {
  const classes = useStlyes(viewerTheme);
  if (!store) {
    return null;
  }
  const { ranks, user } = store;

  const [search, setSearch] = useState<string | undefined>();
  const handleSearch = (e: React.KeyboardEvent) => {
    if (search) {
      if (e.key === 'Enter') {
        ranks.search(search);
      }
    } else {
      ranks.search(undefined);
    }
  };

  const connect = async (): Promise<void> => {
    await user.connect();
  };

  let wizardCount = 0;
  let avatarImage = undefined;
  if (user.wizards && user.wizards.length > 0) {
    wizardCount = user.wizards.length;
    avatarImage = user.wizards[0].image;
  }
  const hasWizards = wizardCount > 0;
  return (
    <div className={classes.appBarContainer}>
      <div className={clsx(classes.titleContainer, classes.baseContainer)}>
        <div className={classes.baseContainer}>
          <img src={'./assets/view_wizard.png'} className={classes.titleIcon} />
          <Typography variant="h4">Forgotten Runes Wizard's Cult</Typography>
        </div>
        {!user.wallet && (
          <Button variant="contained" color="secondary" startIcon={<FlashOnIcon />} onClick={connect}>
            Connect
          </Button>
        )}
        {user.wallet && (
          <div className={classes.accountContainer}>
            <div>
              <Typography
                className={classes.link}
                variant="body1"
                onClick={() => window.open(`https://etherscan.io/address/${user.address}`, '_blank')}
              >
                {`${user.address?.slice(0, 6)}...${user.address?.slice(user.address.length - 4)}`}
              </Typography>
              <Typography variant="caption" align="center">{`${wizardCount} wizards`}</Typography>
            </div>
            {hasWizards && <Avatar alt={'Profile Avatar'} src={avatarImage} className={classes.avatar} />}
          </div>
        )}
      </div>
      <AppBar position="static">
        <Toolbar className={classes.toolbarContainer}>
          <div>
            <FormControlLabel
              control={<Checkbox onClick={ranks.toggleIncludeCount} name="includeTraitCount" />}
              label="Trait Count"
            />
            <FormControlLabel
              control={<Checkbox onClick={ranks.toggleIncludeName} name="includeName" />}
              label="Name Rarity"
            />
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={handleSearch}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
});

export default WizardBar;
