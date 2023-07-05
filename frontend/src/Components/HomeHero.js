import "./HomeHero.css";
import { Link } from 'react-router-dom';

function HomeHero(props) {
  return (
    <>
      <div className={props.cName}>
        <img src={props.heroImg} alt="heroImg" />
        <div className="hero-text">
          <h1>{props.title}</h1>
          <p>{props.text}</p>
          <form class="search" action="">
            <input type="search" placeholder="Search here..." required></input>
            <button type="submit">Search</button>
          </form>
          <a className={props.btnClass} href={props.url}>
            {props.buttonText}
          </a>
        </div>
        {/* <h1>Your Journey Your Story</h1>
        <p>Choose Your Favourite Destination.</p>
        <a href="index.html">Travel Plan</a> */}
      </div>
    </>
  );
}

export default HomeHero;
