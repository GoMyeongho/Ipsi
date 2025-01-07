// import './App.css';
import './style.css';
import { CheckoutPage } from './paySystem/CheckOut';
import { FailPage } from './paySystem/Fail';
import { SuccessPage } from './paySystem/Success';
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
           <Route path='/coverLetter' element={<CoverLetter/>}/>
          </Route>
          {/* CheckoutPage와 관련된 경로 */} 
          <Route path="/checkoutPage" element={<CheckoutPage />} />
          <Route path="/sandbox/success" element={<SuccessPage />} />
          <Route path="/checkoutPage/fail" element={<FailPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
