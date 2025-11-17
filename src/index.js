import ReactDOM from "react-dom/client";
import "./index.css";
import Header from "./components/Header"; 
import Content from "./components/Content";
import Modal from "./components/Modal";


const myComponent = 
<>
<Header/>
<Content/>
<Modal/>
</>

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(myComponent);
