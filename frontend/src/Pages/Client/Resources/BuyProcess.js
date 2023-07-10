import Footer from "../../../Components/Footer";
import Navbar from "../../../Components/Navbar";
import HomeHero from "../../../Components/HomeHero";
import "./ResourcesPage.css"; 

const BuyProcess = () => {
    return (
      <>
      {/* <!-- BEGIN Navigation--> */}
      <HomeHero
        cName="villain"
        heroImg="https://www.gannett-cdn.com/presto/2021/06/21/PNAS/1a51b257-cf34-4d30-a2b3-297589a51dab-Bold_Colors-10.JPG?crop=2611,1469,x1,y226&width=1600&height=800&format=pjpg&auto=webp"
        title="Real Estate"
        text="Choose Your New Estate with Real Estate."
        btnClass="hide"
        url="/"
      />
      {/* <!-- END Navigation--> */}
      <div className="resources-page">
        <h1>For buyers</h1>
        <p><iframe src='https://drive.google.com/file/d/1q-ovBwu9z65k-_AvrGIjd1pq1nXoITKp/preview' width={"980px"} height={"500px"} /> </p>
      </div>
      </>
    );
  }
  
  export default BuyProcess;