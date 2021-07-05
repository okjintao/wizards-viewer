import {
  AppBar,
  Avatar,
  Button,
  Collapse,
  Container,
  fade,
  IconButton,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import { Autocomplete } from '@material-ui/lab';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import store from '../store/RootStore';
import { viewerTheme } from '../viewer.utils';
import WizardFilterOptions from './WizardFilterOptions';

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
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginBottom: theme.spacing(1),
    },
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
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  toolbarContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  link: {
    textDecoration: 'none',
    color: '#e0decc',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  accountContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },
  avatar: {
    marginLeft: theme.spacing(1),
  },
  searchBox: {
    width: '225px',
  },
  filterIcon: {
    marginLeft: theme.spacing(3),
  },
  listOptions: {
    marginLeft: theme.spacing(0.75),
    marginRight: 'auto',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      margin: 'auto',
      paddingTop: theme.spacing(1),
    },
  },
}));

const WizardBar = observer((): JSX.Element | null => {
  const classes = useStlyes(viewerTheme);
  if (!store) {
    return null;
  }
  const { ranks, user } = store;

  const connect = async (): Promise<void> => {
    await user.connect();
  };

  const [showFilter, setShowFilter] = useState(false);

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
              <Typography
                className={classes.link}
                variant="caption"
                onClick={() => window.open(`https://opensea.io/${user.address}`, '_blank')}
              >{`${wizardCount} wizards`}</Typography>
            </div>
            {hasWizards && <Avatar alt={'Profile Avatar'} src={avatarImage} className={classes.avatar} />}
          </div>
        )}
      </div>
      <AppBar position="static">
        <Toolbar className={classes.toolbarContainer}>
          <div className={classes.listOptions}>
            <Typography variant="h6" className={classes.link} onClick={() => ranks.setShowUser(false)}>
              Ranks
            </Typography>
            <Typography
              variant="h6"
              className={clsx(classes.filterIcon, classes.link)}
              onClick={() => ranks.setShowUser(true)}
            >
              My Wizards
            </Typography>
          </div>
          <div className={classes.searchContainer}>
            <div className={classes.search}>
              <Autocomplete
                id="wizard-filter"
                blurOnSelect
                freeSolo
                options={ranks.searchOptions}
                getOptionLabel={(option) => option}
                onChange={(_e, val) => ranks.search(val ?? undefined)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      style: { color: '#fff' },
                    }}
                  />
                )}
                className={classes.searchBox}
              />
            </div>
            <IconButton color="inherit" onClick={() => setShowFilter(!showFilter)}>
              <FilterListIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Container>
        <Collapse in={showFilter} unmountOnExit>
          <WizardFilterOptions />
        </Collapse>
      </Container>
    </div>
  );
});

export default WizardBar;
