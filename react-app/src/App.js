import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import { authenticate } from "./store/session";
import { clearGallery } from "./store/gallery";
import Navigation from "./components/Navigation";
import Gallery from "./components/GalleryPage";
import Profile from "./components/ProfilePage";
import HomePage from "./components/HomePage";
import NewGallery from "./components/NewGalleryPage";
import UpdateGallery from "./components/UpdateGalleryPage";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import Followers from "./components/Followers";
import Following from "./components/Following";
import ReactGA from "react-ga";
import RouteChangeTracker from "./components/RouteChangeTracker";

ReactGA.initialize(process.env.GA_TRACKING_ID);

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    if (
      !(
        pathname.split("/")[1] === "galleries" &&
        pathname.indexOf("new") === -1 &&
        pathname.indexOf("update") === -1
      )
    ) {
      dispatch(clearGallery());
    }
  }, [pathname]);

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
          <Route exact path="/profiles/:profileUsername/followers">
            <Followers />
          </Route>
          <Route exact path="/profiles/:profileUsername/following">
            <Following />
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
      <RouteChangeTracker />
    </>
  );
}

export default App;
