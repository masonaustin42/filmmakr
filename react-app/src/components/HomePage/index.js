import "./HomePage.css";
function HomePage() {
  return (
    <div id="home-page-container">
      <video id="home-video" muted={true} loop={true} autoPlay={true}>
        <source src="https://d2t8ka78u48u9v.cloudfront.net/assets/preview.mov" />
      </video>
      <div id="home-title-container">
        <h1 id="home-title">Filmmakr</h1>
      </div>

      <h2>Why Filmmakr?</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu lacinia
        orci, at varius nisi. Duis at mollis ipsum. Aliquam turpis lectus,
        dictum pharetra nisi eu, fringilla blandit nisl. Quisque iaculis
        bibendum dui, non sagittis ligula venenatis sit amet. Maecenas tristique
        turpis non nibh tristique, eu semper velit semper. Suspendisse fermentum
        feugiat rutrum. Etiam non erat eu lorem bibendum porttitor bibendum vel
        lorem. Nulla faucibus efficitur turpis non ultrices. Proin urna ante,
        commodo sit amet risus eu, vehicula malesuada elit. Aliquam eu luctus
        massa, at egestas ex. Nulla interdum, dui a interdum dictum, risus justo
        laoreet ipsum, euismod ultricies mi ex non ante. Phasellus sodales
        egestas sollicitudin. Proin lobortis nibh magna, quis semper metus porta
        vitae. Donec molestie pharetra nisl ac venenatis. Aliquam ullamcorper
        felis ut magna posuere pellentesque. Nullam molestie magna a lectus
        feugiat imperdiet.
      </p>
    </div>
  );
}

export default HomePage;
