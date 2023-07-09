import Footer from "../../../Components/Footer";
import Navbar from "../../../Components/Navbar";
import HomeHero from "../../../Components/HomeHero";

const PropNews = () => {
    return (
      <>
      {/* <!-- BEGIN Navigation--> */}
      <HomeHero
        cName="hero"
        heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
        title="Real Estate"
        text="Property News"
        btnClass="hide"
        url="/"
      />
      {/* <!-- END Navigation--> */}
        <h1>Property News</h1>
        <p> </p>
      </>
    );
  }
  
  export default PropNews;