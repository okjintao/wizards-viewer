import { makeStyles, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import Affinity from '../components/Affinity';
import { StoreContext } from '../store/StoreContext';
import { viewerTheme } from '../viewer.utils';

const useStyles = makeStyles((theme) => ({
  affinityContainer: {
    padding: theme.spacing(3),
    minHeight: '70vh',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0),
    },
  },
  infoContainer: {
    display: 'flex',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(0),
    },
  },
  scrollImage: {
    width: '20%',
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(-8),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  textItem: {
    marginBottom: theme.spacing(1),
  },
  itemContainer: {
    marginTop: theme.spacing(2),
    justifyContent: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  affinityItem: {
    width: '110px',
    marginBottom: theme.spacing(2),
  },
  exampleContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
}));

const Traits = observer((): JSX.Element => {
  const store = useContext(StoreContext);
  const classes = useStyles(viewerTheme);
  const { state, ranks } = store;
  const { traitsToAffinity, traitMap } = ranks.wizardSummary;
  return (
    <div className={classes.affinityContainer}>
      <Typography variant="h4" align="center">
        What is a Trait?
      </Typography>
      <div className={classes.infoContainer}>
        <div>
          <Typography variant="body1" className={classes.textItem}>
            A trait is a visual property of your wizard. These properties span six categories: Background, Prop, Rune,
            Head, Body, and Familiar. Most traits, excluding backgrounds, in the Forgotten Runes Wizard's Cult are
            included in one or more affinities. While rare, it is possible a trait has no affinities.
          </Typography>
          <Typography variant="body1" className={classes.textItem}>
            Traits have two different affinity types: Identity Affinity and Positive Affinity. The first are affinities
            that the trait embodies - it is that affinity. The second are affinities that trait is drawn to - they are
            more likely to occur together.
          </Typography>
        </div>
        <img src="/assets/trait_example.png" className={classes.scrollImage} />
      </div>
      {state.trait && (
        <>
          <Typography variant="h5" align="center">
            {traitMap[state.trait]}
          </Typography>
          <div className={classes.cardContainer}>
            {traitsToAffinity[state.trait].identity.map((item) => {
              return <Affinity key={item} id={item} identity />;
            })}
          </div>
          <div className={classes.cardContainer}>
            {traitsToAffinity[state.trait].positive.map((item) => {
              return <Affinity key={item} id={item} identity={false} />;
            })}
          </div>
        </>
      )}
    </div>
  );
});

export default Traits;
