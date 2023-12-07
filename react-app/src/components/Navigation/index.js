import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const { pathname } = useLocation();

  let navBarClass;

  if (
    pathname === "/" ||
    (pathname.split("/")[1] === "galleries" &&
      pathname.indexOf("new") === -1 &&
      pathname.indexOf("update") === -1)
  ) {
    navBarClass = "navbar-home-page";
  } else {
    navBarClass = "navbar-other";
  }

  document.addEventListener("scroll", () => {
    const navbar = document.querySelector("#navbar");
    if (window.scrollY > 0) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  });

  return (
    <nav id="navbar" className={navBarClass}>
      <div>
        <NavLink exact to="/" id="navbar-home-button">
          Filmmakr
        </NavLink>
      </div>
      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
