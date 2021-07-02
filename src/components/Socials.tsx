import { IconButton, makeStyles } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import Twitter from '@material-ui/icons/Twitter';

const useStlyes = makeStyles(() => ({
  icon: {
    height: '33px',
    width: '33px',
  },
  githubIcon: {
    height: '26px',
    width: '26px',
  },
  baseContainer: {
    alignItems: 'center',
    display: 'flex',
  },
}));

export default function Socials(): JSX.Element {
  const classes = useStlyes();
  return (
    <div className={classes.baseContainer}>
      <IconButton color="inherit" onClick={() => window.open('https://twitter.com/axejintao', '_blank')}>
        <Twitter className={classes.icon} />
      </IconButton>
      <IconButton color="inherit" onClick={() => window.open('https://discord.com/invite/F7WbxwJuZC', '_blank')}>
        <img src={'./assets/discord.png'} className={classes.icon} />
      </IconButton>
      <IconButton color="inherit" onClick={() => window.open('https://github.com/axejintao/wizards-viewer', '_blank')}>
        <GitHubIcon className={classes.githubIcon} />
      </IconButton>
    </div>
  );
}
