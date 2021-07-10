import {
  AppBar,
  Avatar,
  Button,
  Collapse,
  Container,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StoreContext } from '../store/StoreContext';
import { viewerTheme } from '../viewer.utils';
import SearchBar, { SearchHandler } from './SearchBar';
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
  avatar: {
    marginLeft: theme.spacing(1),
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
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
  },
  routerLink: {
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%',
    },
  },
  filterButton: {
    marginLeft: theme.spacing(1),
  },
}));

const WizardBar = observer((): JSX.Element | null => {
  const location = useLocation();
  const store = useContext(StoreContext);
  const classes = useStlyes(viewerTheme);
  const { ranks, user, state } = store;
  const { affinityOccurences, traitMap } = ranks.wizardSummary;

  let wizardCount = 0;
  let avatarImage = undefined;
  if (user.wizards && user.wizards.length > 0) {
    wizardCount = user.wizards.length;
    avatarImage = user.wizards[0].image;
  }
  const hasWizards = wizardCount > 0;

  const affinityOptions = Object.entries(affinityOccurences)
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0]);

  const traitReverseLookup = Object.fromEntries(Object.entries(traitMap).map((trait) => [trait[1], trait[0]]));
  const traitOptions = Object.entries(traitMap)
    .sort((a, b) => {
      const [_keyA, valueA] = a;
      const [_keyB, valueB] = b;
      const rarityA = ranks.getRarity(valueA);
      const rarityB = ranks.getRarity(valueB);
      return rarityA - rarityB;
    })
    .map((e) => e[1]);

  const handleTraitSearch: SearchHandler = (_e, val): void => {
    if (!val) {
      return;
    }
    state.setTrait(Number(traitReverseLookup[val]));
  };

  const handleAffinitySearch: SearchHandler = (_e, val): void => {
    if (!val) {
      return;
    }
    const [_affinity, id] = val.split(' ');
    state.setAffinity(Number(id));
  };

  return (
    <div className={classes.appBarContainer}>
      <div className={clsx(classes.titleContainer, classes.baseContainer)}>
        <div className={classes.baseContainer}>
          <img src={'./assets/view_wizard.png'} className={classes.titleIcon} />
          <Typography variant="h4">Forgotten Runes Wizard's Cult</Typography>
        </div>
        {!user.wallet && (
          <Button variant="contained" color="secondary" startIcon={<FlashOnIcon />} onClick={user.connect}>
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
            <Link to="/" className={classes.routerLink}>
              <Typography align="center" variant="h6" className={classes.link} onClick={() => ranks.setShowUser(false)}>
                Ranks
              </Typography>
            </Link>
            <Link to="/" className={classes.routerLink}>
              <Typography
                align="center"
                variant="h6"
                className={clsx(classes.filterIcon, classes.link)}
                onClick={() => ranks.setShowUser(true)}
              >
                My Wizards
              </Typography>
            </Link>
            <Link to="/affinities" className={classes.routerLink}>
              <Typography align="center" variant="h6" className={clsx(classes.filterIcon, classes.link)}>
                Affinities
              </Typography>
            </Link>
            <Link to="/traits" className={classes.routerLink}>
              <Typography align="center" variant="h6" className={clsx(classes.filterIcon, classes.link)}>
                Traits
              </Typography>
            </Link>
          </div>
          {location.pathname === '/' && (
            <div className={classes.buttonContainer}>
              <SearchBar options={ranks.searchOptions} handleChange={(_e, val) => ranks.search(val ?? undefined)} />
              <IconButton color="inherit" onClick={() => state.setShowFilter(!state.showFilter)} className={classes.filterButton}>
                <FilterListIcon />
              </IconButton>
            </div>
          )}
          {location.pathname === '/affinities' && (
            <SearchBar
              options={affinityOptions.map((affinity) => `Affinity ${affinity}`)}
              handleChange={handleAffinitySearch}
            />
          )}
          {location.pathname === '/traits' && <SearchBar options={traitOptions} handleChange={handleTraitSearch} />}
        </Toolbar>
      </AppBar>
      <Container>
        <Collapse in={state.showFilter} unmountOnExit>
          <WizardFilterOptions />
        </Collapse>
      </Container>
    </div>
  );
});

export default WizardBar;
