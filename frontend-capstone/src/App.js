import './App.css';
import CoverLetter from './pages/CoverLetter';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './styles/Layout';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <GlobalStyle/>
      <Router>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route path='/coverletter' element={<CoverLetter/>}/>

          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
