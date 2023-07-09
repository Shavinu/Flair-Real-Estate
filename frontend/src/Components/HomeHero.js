import "./HomeHero.css";

function HomeHero(props) {

  return (
    <>
      <div className={props.cName}>
        <img src={props.heroImg} alt="heroImg" />
        <div className="hero-text">
          <h1>{props.title}</h1>
          <p>{props.text}</p>
        </div>
      </div>
    </>
  );
}

export default HomeHero;
