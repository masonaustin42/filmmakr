import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import Gallery from "./components/GalleryPage";
import Profile from "./components/ProfilePage";
import HomePage from "./components/HomePage";
import NewGallery from "./components/NewGalleryPage";
import UpdateGallery from "./components/UpdateGalleryPage";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/galleries/new">
            <NewGallery />
          </Route>
          <Route path="/galleries/:galleryId/update">
            <UpdateGallery />
          </Route>
          <Route exact path="/galleries/:galleryId">
            <Gallery />
          </Route>
          <Route path="/profiles/:profileUsername">
            <Profile />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      )}
      <Footer />
    </>
  );
}

export default App;
