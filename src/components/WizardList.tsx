import { Container, List, makeStyles, TablePagination } from '@material-ui/core';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { store } from '../Viewer';
import { viewerTheme } from '../viewer.utils';
import Socials from './Socials';
import WizardListItem from './WizardListItem';

const useStyles = makeStyles((theme) => ({
  itemContainer: {
    marginBottom: theme.spacing(4),
  },
  centerContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const WizardList = observer(() => {
  const classes = useStyles(viewerTheme);
  const { ranks } = store;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const start = page * pageSize;
  const end = (page + 1) * pageSize;

  if (ranks.isSorting) {
    return null;
  }

  return (
    <div className={classes.itemContainer}>
      <Container>
        <List dense>
          {ranks.wizards.slice(start, end).map((wizard) => (
            <WizardListItem key={wizard.id} wizard={wizard} />
          ))}
        </List>
      </Container>
      <div className={clsx(classes.itemContainer, classes.centerContainer)}>
        <TablePagination
          component="div"
          count={Math.ceil(ranks.wizards.length / pageSize)}
          page={page}
          rowsPerPage={pageSize}
          onChangePage={(_e, page) => setPage(page)}
          onChangeRowsPerPage={(e) => setPageSize(Number(e.target.value))}
        />
      </div>
      <div className={classes.centerContainer}>
        <Socials />
      </div>
    </div>
  );
});

export default WizardList;
