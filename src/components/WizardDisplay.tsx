import { makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { WizardData } from '../interface/wizard-data.interface';
import { StoreContext } from '../store/StoreContext';
import {
  getAffinityRarityDescriptor,
  getRarityColor,
  getRarityDescriptor,
  randomWizard,
  viewerTheme,
} from '../viewer.utils';

const useStyles = makeStyles((theme) => ({
  wizardDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '440px',
    padding: theme.spacing(1),
    backgroundImage: `url(./assets/tower.png)`,
    backgroundPosition: 'center bottom 60px',
    backgroundRepeat: 'no-repeat',
  },
  spriteContainer: {
    marginTop: theme.spacing(1),
    height: '150px',
    width: '150px',
    marginBottom: 'auto',
  },
  spriteImage: {
    position: 'absolute',
  },
  traitContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    width: '280px',
    padding: theme.spacing(2),
    color: '#e0decc',
    maxHeight: '430px',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  traitItem: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    justifyContent: 'space-between',
  },
  descriptor: {
    flexBasis: '60%',
  },
  section: {
    paddingBottom: theme.spacing(1),
  },
  rankDisplay: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexContainer: {
    display: 'flex',
  },
  rankContainer: {
    justifyContent: 'space-around',
  },
  rarity: {
    paddingTop: theme.spacing(-0.25),
  },
}));

const WizardDisplay = observer((): JSX.Element | null => {
  const classes = useStyles(viewerTheme);
  const store = useContext(StoreContext);
  const { info, ranks } = store;
  const { ranking, wizardSummary } = ranks;
  const { affinityOccurences, totalWizards } = wizardSummary;

  let wizard: WizardData;
  if (info.expanded) {
    wizard = ranking[info.expanded - 1];
  } else {
    wizard = randomWizard(wizardSummary);
  }
  const images = Object.entries(wizard.traits)
    .filter((entry) => {
      const [_key, value] = entry;
      const traitType = value.split(': ')[0];
      return traitType !== 'background';
    })
    .map((e) => `/assets/traits/${e[0]}.png`);
  const rank = wizard.rank || wizard.idx;
  const rankStyle = { color: getRarityColor(rank / totalWizards) };

  const affinities = Object.fromEntries(Object.entries(wizard.affinities).filter((e) => e[1] >= 3));
  const hasAffinities = Object.keys(affinities).length > 0;
  const otherAffinities = Object.keys(wizard.affinities).length - Object.keys(affinities).length;
  const affinityPercentage = (wizard.affinities[wizard.maxAffinity] / (wizard.traitCount - 1)) * 100;

  return (
    <div className={classes.wizardDisplay}>
      <div className={classes.spriteContainer}>
        {images.map((image) => (
          <img key={image} src={image} className={clsx(classes.spriteContainer, classes.spriteImage)} />
        ))}
      </div>
      <Paper className={classes.traitContainer}>
        <Typography
          variant="body1"
          align="center"
          style={rankStyle}
          className={info.expanded ? classes.section : undefined}
        >
          {wizard.name}
        </Typography>
        {!info.expanded && (
          <Typography variant="caption" align="center" className={!info.expanded ? classes.section : undefined}>
            (Randomly Generated Wizard)
          </Typography>
        )}
        <div className={clsx(classes.section, classes.flexContainer, classes.rankContainer)}>
          <div className={classes.rankDisplay}>
            <Typography variant="caption" align="center">
              Serial ID
            </Typography>
            <Typography variant="caption" align="center">
              {wizard.idx}
            </Typography>
          </div>
          <div className={classes.rankDisplay}>
            <Typography variant="caption" align="center">
              Rank
            </Typography>
            <Typography variant="caption" align="center">
              {wizard.rank}
            </Typography>
          </div>
          <div className={classes.rankDisplay}>
            <Typography variant="caption" align="center">
              Score
            </Typography>
            <Typography variant="caption" align="center">
              {wizard.score}
            </Typography>
          </div>
        </div>
        <Typography variant="body1" align="center" className={classes.section}>
          Traits
        </Typography>
        <div className={classes.section}>
          {Object.values(wizard.traits).map((trait, i) => {
            const traitParts = trait.split(': ');
            const traitType = traitParts[0];
            const traitName = traitParts.slice(1).join(': ');
            const traitRarity = getRarityDescriptor(ranks.getRarity(trait));
            const traitColor = getRarityColor(ranks.getRarity(trait));
            const traitStyle = { color: traitColor };
            const traitCount = ranks.getRarityOccurence(trait);
            return (
              <div key={`trait-${i}`} className={classes.traitItem}>
                <div className={classes.descriptor}>
                  <Typography variant="body2" align="left">
                    {traitType.charAt(0).toUpperCase() + traitType.slice(1)} ({traitCount})
                  </Typography>
                  <Typography variant="caption" align="left" style={traitStyle} className={classes.rarity}>
                    {traitRarity}
                  </Typography>
                </div>
                <Typography variant="body2" align="right">
                  {traitName}
                </Typography>
              </div>
            );
          })}
        </div>
        <Typography variant="body1" align="center" className={classes.section}>
          {affinityPercentage.toFixed()}% Affinity
        </Typography>
        <div className={classes.section}>
          {hasAffinities &&
            Object.entries(affinities)
              .sort((a, b) => {
                if (a[1] === b[1]) {
                  return affinityOccurences[a[0]] - affinityOccurences[b[0]];
                }
                return b[1] - a[1];
              })
              .map((entry) => {
                const [key, value] = entry;
                const affinityRarity = getAffinityRarityDescriptor(ranks.getAffinityRarity(key));
                const affinityColor = getRarityColor(ranks.getAffinityRarity(key));
                const affinityStyle = { color: affinityColor };
                const percentageColor = value === 5 ? '#ec3fa8' : 'inherit';
                const percentageStyle = { color: percentageColor };
                return (
                  <div key={`affinity-${key}`} className={classes.traitItem}>
                    <div className={classes.descriptor}>
                      <Typography variant="body2" align="left" style={percentageStyle}>
                        Affinity {key} ({affinityOccurences[key]})
                      </Typography>
                      <Typography variant="caption" align="left" style={affinityStyle}>
                        {affinityRarity}
                      </Typography>
                    </div>
                    <Typography variant="body2" align="right" style={percentageStyle}>
                      {value} / {wizard.traitCount - 1} traits
                    </Typography>
                  </div>
                );
              })}
          {!hasAffinities && (
            <Typography variant="body2" align="center" className={classes.section}>
              0 notable affinities
            </Typography>
          )}
          {otherAffinities > 0 && (
            <Typography variant="body2" align="center">
              {otherAffinities} other {otherAffinities > 1 ? 'affinities' : 'affinity'}
            </Typography>
          )}
        </div>
      </Paper>
    </div>
  );
});

export default WizardDisplay;
