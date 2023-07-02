import { useEffect } from "react"
import { Link } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    console.log('load');
  }, []);

  return (<>
    This is Home Page
    <Link to="/second-level"> Select</Link>
  </>);
}

export default Home
