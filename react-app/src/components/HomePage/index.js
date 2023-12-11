import "./HomePage.css";
function HomePage() {
  return (
    <div id="home-page-container">
      <video
        id="home-video"
        autoPlay={true}
        muted={true}
        loop={true}
        preload=""
        playsInline={true}
        disablePictureInPicture={true}
        disableRemotePlayback={true}
      >
        <source src="https://d2t8ka78u48u9v.cloudfront.net/assets/preview.mov" />
      </video>
      <div id="home-title-container">
        <h1 id="home-title">Filmmakr</h1>
      </div>

      <h2>Why Filmmakr?</h2>
      <p>
        Welcome to Filmmakr, your ultimate video hosting and delivery platform
        tailored for videographers seeking effortless management and elegant
        presentation. With Filmmakr, you'll experience a streamlined process
        from upload to showcase. Seamlessly upload your videos and curate them
        into stunning, customizable galleries that exude professionalism and
        creativity. Effortlessly deliver these galleries to clients or display
        them in your portfolio, showcasing your artistry in the best light
        possible. Our user-friendly interface ensures easy organization and
        presentation, allowing you to focus on what you do best—creating
        captivating videos. Elevate your videography game with Filmmakr, where
        hosting, delivery, and presentation converge seamlessly for a truly
        remarkable experience.
      </p>
    </div>
  );
}

export default HomePage;
