import PropTypes from 'prop-types';
import { useCallback, useState } from "react";
import { SearchContext } from "./search-context";

const defaultSearch = {
  searchTerm: '',
  minPrice: 0,
  maxPrice: 0,
  type: 'All',
}
const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState(defaultSearch)
  const onSearch = useCallback(
    (name, value) => {
      setSearchResults((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  )
  return <SearchContext.Provider value={{ searchResults, onSearch }}>
    {children}
  </SearchContext.Provider>
}

SearchProvider.propTypes = {
  children: PropTypes.node
}

export default SearchProvider;
