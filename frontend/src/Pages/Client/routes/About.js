import Footer from "../../../Components/Footer";
import NavbarUser from "../../../Components/NavbarUser";
import AboutUs from "../About/AboutUs";
import HomeHero from "../../../Components/HomeHero";

const About = () => {
  return (
    <>
      <NavbarUser />
      <HomeHero
        cName="hero"
        heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
        title="Real Estate"
        text="Choose Your New Estate with Real Estate."
        btnClass="hide"
        url="/"
      />
      <AboutUs />
      <Footer />
    </>
  );
}

export default About;
