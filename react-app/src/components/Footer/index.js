import "./Footer.css";
const Footer = () => {
  return (
    <footer>
      <div>
        <a id="footer-home-button" href="/">
          Filmmakr
        </a>
      </div>
      <div>
        <p>Filmmakr was created by Mason Austin.</p>
        <ul>
          <li>
            <a href="https://www.linkedin.com/in/mason-austin-a1b568240/">
              <i id="linkedin" className="fa-brands fa-linkedin"></i>
            </a>
          </li>
          <li>
            <a href="https://github.com/masonaustin42">
              <i id="github" className="fa-brands fa-github"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
