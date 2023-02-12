import { useHistory } from "react-router-dom";
import "./homepage.css";
import logo from "../../assets/giburi-logo.png";

const HomePage = () => {
  const history = useHistory();

  return (
    <div className="homepage">
      <img className="homepage-logo" src={logo}></img>
      <br></br>
      <button className="homepage-button" onClick={() => history.push("/")}>Enter</button>
    </div>
  );
};

export default HomePage;
