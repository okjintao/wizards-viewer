import {
  AppBar,
  Checkbox,
  fade,
  FormControlLabel,
  IconButton,
  InputBase,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import SearchIcon from '@material-ui/icons/Search';
import Twitter from '@material-ui/icons/Twitter';
import clsx from 'clsx';
import React, { useState } from 'react';
import { store } from '../Viewer';
import { viewerTheme } from '../viewer.utils';

const useStlyes = makeStyles((theme) => ({
  appBarContainer: {
    marginBottom: theme.spacing(2),
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
}));

export function WizardBar(): JSX.Element | null {
  const classes = useStlyes(viewerTheme);
  if (!store) {
    return null;
  }
  const { ranks } = store;

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

  return (
    <div className={classes.appBarContainer}>
      <div className={clsx(classes.titleContainer, classes.baseContainer)}>
        <div className={classes.baseContainer}>
          <img src={'./assets/view_wizard.png'} className={classes.titleIcon} />
          <Typography variant="h4">Forgotten Runes Wizard's Cult</Typography>
        </div>
        <div className={classes.baseContainer}>
          <IconButton color="inherit" onClick={() => window.open('https://twitter.com/axejintao', '_blank')}>
            <Twitter className={classes.icon} />
          </IconButton>
          <IconButton color="inherit" onClick={() => window.open('https://discord.com/invite/F7WbxwJuZC', '_blank')}>
            <img src={'./assets/discord.png'} className={classes.icon} />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => window.open('https://github.com/axejintao/wizards-viewer', '_blank')}
          >
            <GitHubIcon className={classes.icon} />
          </IconButton>
        </div>
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
}
