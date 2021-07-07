import { fade, makeStyles, TextField } from '@material-ui/core';
import { Autocomplete, AutocompleteChangeReason } from '@material-ui/lab';
import { observer } from 'mobx-react-lite';
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

export type SearchHandler = (e: React.ChangeEvent<unknown>, v: string | null, r: AutocompleteChangeReason) => void;
export interface SearchBarProps {
  options: string[];
  placeholder?: string;
  handleChange?: SearchHandler;
}

const SearchBar = observer((props: SearchBarProps): JSX.Element => {
  const classes = useStlyes(viewerTheme);
  const { options, placeholder, handleChange } = props;

  return (
    <div className={classes.searchContainer}>
      <div className={classes.search}>
        <Autocomplete
          id="wizard-filter"
          blurOnSelect
          freeSolo
          options={options}
          getOptionLabel={(option) => option}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={placeholder || 'Search'}
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
    </div>
  );
});

export default SearchBar;
