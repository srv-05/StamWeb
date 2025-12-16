// src/pages/Home.jsx
import "../styles/pages/home.css";
import bgImage from "../assets/home_background.jpg";

function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <div className="hero-root" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="hero-overlay" />

        <main className="hero-content">
          <section className="hero-left">
            <div className="hero-center">
              <h1 className="hero-title">
                <span>Stamatics</span>
                <br />
                <span>IIT Kanpur</span>
              </h1>

              <p className="hero-subtitle">
                Bring problems. Leave with answers.
              </p>
            </div>
          </section>

          <section className="hero-right" />
        </main>
      </div>

      {/* ABOUT US SECTION (OUTSIDE HERO, BUT VISUALLY OVERLAPS IT) */}
      <section className="about-full">
        <div className="about-full-inner">
          <h2 className="about-full-title">About Us</h2>
          <p className="about-full-text">
            Stamatics is the student society of Mathematics in IIT Kanpur. Throughout the year, we organises various mathematical competitions, 
            talks by professors and students, workshops, and numerous formal and informal sessions aimed at guiding students towards a fruitful academic and professional life, 
            both on campus and beyond. Stamatics also runs a Mathematics blog, dedicated to shedding light on the subject and fostering a deeper interest in Mathematics.
          </p>
          <p className="about-full-text">
            In essence, Stamatics is a collective of individuals who strive to bring opportunities, interesting research, fun puzzles, and valuable guidance from seniors out 
            in the open and make them accessible to everyone on campus.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;
