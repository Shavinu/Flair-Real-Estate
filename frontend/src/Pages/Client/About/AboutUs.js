import "./AboutUs.css";
import HomeHero from "../../../Components/HomeHero";

const AboutUs = () => {
  return ( <>
    {/* <!-- BEGIN Navigation--> */}
    <HomeHero
      cName="hero"
      heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
      title="Real Estate"
      text="About Us"
      btnClass="hide"
      url="/"
    />
    {/* <!-- END Navigation--> */}
    <div className="about-container">
      <h1>About Us</h1>
        <p>Flair Real Estate pride themselves on their ability to create genuine customer connections and build meaningful rapport through sharing in depth local knowledge and perspectives.</p>
        <p>Our agency is founded on the belief that we can provide a personalised service which is simply impossible for the big chains to replicate. Why be considered just a number when you are making one of the biggest decisions of your life?</p>
        <p>With an exceptional track record of achieving record sales and a long list of referrals and repeat customers, we take the time to get to know your situation and priorities. Building unique campaigns that catch the eyes of the widest possible number of potential buyers, we constantly strive to maximise your sales potential.</p>
        <p>Our ability to enhance and streamline online exposure through embracing technology makes Flair Real Estate one of the most exciting agencies in the area.</p>
      <h2>Our History</h2>
      <p>Real Estate is a new company.</p>

      <h2>Our Mission</h2>
      <p>Our mission is</p>

      <h2>Our Vision</h2>
      <p>Our vision is</p>

      <h2>Our Agent</h2>
      <p></p>
    </div>
    </>
  );
}

export default AboutUs;
