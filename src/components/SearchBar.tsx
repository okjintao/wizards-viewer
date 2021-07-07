import { fade, IconButton, makeStyles, TextField } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Autocomplete } from '@material-ui/lab';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from '../store/StoreContext';
import { viewerTheme } from '../viewer.utils';

const useStlyes = makeStyles((theme) => ({
  search: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },
  searchBox: {
    width: '225px',
  },
}));

const SearchBar = observer((): JSX.Element => {
  const classes = useStlyes(viewerTheme);
  const store = useContext(StoreContext);
  const { ranks, state } = store;
  return (
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
      <IconButton color="inherit" onClick={() => state.setShowFilter(!state.showFilter)}>
        <FilterListIcon />
      </IconButton>
    </div>
  );
});

export default SearchBar;
