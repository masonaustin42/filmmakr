import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function SearchResult({ result, resetSearch }) {
  const history = useHistory();

  const handleClick = (location, isUser = false) => {
    if (isUser) {
      history.push(`/profiles/${location}`);
    } else {
      history.push(`/galleries/${location}`);
    }
    resetSearch();
  };

  const VIDEO_TYPES = ["mp4", "mov", "avi", "mpeg"];
  const IMAGE_TYPES = ["jpg", "jpeg", "png", "tiff"];

  const MatchElementToItem = (item) => {
    let itemType;
    if (!item.preview) return <div className="no-preview"></div>;
    itemType = item.preview
      .split(".")
      [item.preview.split(".").length - 1].toLowerCase();
    if (VIDEO_TYPES.includes(itemType)) {
      return (
        <video autoPlay controls={false} loop muted>
          <source src={`${item.preview}`} />
        </video>
      );
    } else if (IMAGE_TYPES.includes(itemType)) {
      return <img alt="" src={`${item.preview}`} />;
    } else {
      return <div className="no-preview"></div>;
    }
  };

  if (result.username) {
    return (
      <div
        className="search-result"
        onClick={() => handleClick(result.username, true)}
      >
        {result.profile_pic ? (
          <img src={result.profile_pic} alt="profile" />
        ) : (
          <div className="no-preview"></div>
        )}
        <p>{result.username}</p>
      </div>
    );
  } else {
    return (
      <div className="search-result" onClick={() => handleClick(result.id)}>
        {MatchElementToItem(result)}
        <p>{result.title}</p>
      </div>
    );
  }
}

export default SearchResult;
