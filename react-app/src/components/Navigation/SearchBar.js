import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGalleries } from "../../store/galleries";
import { getAllUsers } from "../../store/users";
import SearchResult from "./SearchResult";
import "./Search.css";

function SearchBar() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { galleries, users } = useSelector((state) => state);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef();

  useEffect(() => {
    dispatch(getAllGalleries());
    dispatch(getAllUsers());
  }, []);

  useEffect(() => {
    const closeSearch = document.addEventListener("click", (e) => {
      if (!searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    });

    return () => document.removeEventListener("click", closeSearch);
  }, [showSearch]);

  const resetSearch = () => setSearch("");

  useEffect(() => {
    const newSearchResults = [];
    const searchTerms = search.split(" ");
    for (let i = 0; i < searchTerms.length; i++) {
      const term = searchTerms[i].toLowerCase();
      if (term === "") continue;
      const galleriesArr = Object.values(galleries);
      const usersArr = Object.values(users);
      for (let j = 0; j < galleriesArr.length; j++) {
        const gallery = galleriesArr[j];
        const galleryTitle = gallery.title.toLowerCase();
        if (galleryTitle.indexOf(term) !== -1) {
          newSearchResults.push(gallery);
        }
      }
      for (let j = 0; j < usersArr.length; j++) {
        const user = usersArr[j];
        const username = user.username.toLowerCase();
        if (username.indexOf(term) !== -1) {
          newSearchResults.push(user);
        }
      }
    }
    setSearchResults(newSearchResults);
  }, [search]);

  return (
    <div ref={searchRef}>
      <div id="searchbar">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onFocus={() => setShowSearch(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSearch(true);
          }}
        />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>
      <div id="search-container">
        {showSearch && search !== "" && searchResults.length > 0 && (
          <div id="search-results">
            {searchResults.map((result) => {
              return <SearchResult result={result} resetSearch={resetSearch} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
