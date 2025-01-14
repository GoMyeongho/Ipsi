// import './App.css';
import "./style.css";
import { CheckoutPage } from "./paySystem/CheckOut";
import { FailPage } from "./paySystem/Fail";
import { SuccessPage } from "./paySystem/Success";
import CoverLetter from "./pages/CoverLetter";
import GlobalStyle from "./styles/GlobalStyle";
import Layout from "./styles/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoverLetterDetail from "./pages/CoverLetterDetail";
import ModalExample from "./example/ModalExample";
import AccordionExample from "./example/AccordionExample";
import AdminNav from "./pages/admin/AdminNav";
import PermissionMain from "./pages/admin/auth/list/PermissionMain";
import PermissionStore from "./context/admin/PermissionStore";
import TestLogin from "./pages/auth/login/TestLogin";
import CoverLetterWrite from "./pages/CoverLetterWrite";
import MyPageNavBar from "./component/MyPageNavBar";
import CoverLetterRegister from "./pages/myPage/CoverLetterRegister";

// import ChatList from './pages/chat/ChatList';
// import ChatRoomCreate from './pages/chat/ChatRoomCreate';
// import Chatting from './pages/chat/Chatting';

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/login" element={<TestLogin />}></Route>
          <Route path="/" element={<Layout />}>
            <Route path="/coverLetter" element={<CoverLetter />} />
            <Route path="/coverLetterWrite" element={<CoverLetterWrite />} />
            <Route path="/coverLetterDetail" element={<CoverLetterDetail />} />
            <Route path="/myPageNavBar" element={<MyPageNavBar/>}>
              <Route path="coverLetterRegister" element={<CoverLetterRegister/>}/>
            </Route>
            <Route path="/test/modal" element={<ModalExample />} />
            <Route path="/test/accordion" element={<AccordionExample />} />
            {/*<Route path='/chat' element={<ChatList />} />*/}
            {/*<Route path='/chat-create' element={<ChatRoomCreate />}/>*/}
            {/*<Route path='/chatting/:roomId' element={<Chatting />}/>*/}
            <Route
              path="/admin"
              element={
                <PermissionStore>
                  <AdminNav />
                </PermissionStore>
              }
            >
              <Route path="auth" element={<PermissionMain />} />
            </Route>
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
