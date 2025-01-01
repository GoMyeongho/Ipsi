//  import logo from './logo.svg';
import './App.css';
import Layout from './styles/Layout';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Layout/>
      </Router>
    </>
  );
}

export default App;
