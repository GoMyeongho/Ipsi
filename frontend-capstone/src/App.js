import './style.css';
import { CheckoutPage } from './paySystem/CheckOut';
import { FailPage } from './paySystem/Fail';
import { SuccessPage } from './paySystem/Success';
import CoverLetter from './pages/CoverLetter';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './styles/Layout';
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
import ChatStore from './context/ChatStore';
import TextStore, { PostLayout } from "./context/TextStore";
import PostListMain from "./pages/text/post/list/PostListMain";
import PostItemMain from "./pages/text/post/item/PostItemMain";
import OAuth from './pages/auth/login/OAuth';

import {useState} from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          {/* 로그인 페이지 */}
          <Route path="/login" element={<TestLogin />} />
          
          {/* 메인 레이아웃 적용 */}
          <Route path="/" element={<ChatStore><Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /></ChatStore>}>
            <Route path="coverLetter" element={<CoverLetter />} />
            <Route path="coverLetterWrite" element={<CoverLetterWrite />} />
            <Route path="coverLetterDetail" element={<CoverLetterDetail />} />
            
            {/* 마이페이지 내비게이션 */}
            <Route path="myPageNavBar" element={<MyPageNavBar />}>
              <Route path="coverLetterRegister" element={<CoverLetterRegister />} />
            </Route>
            
            {/* 테스트 페이지 */}
            <Route path="test/modal" element={<ModalExample />} />
            <Route path="test/accordion" element={<AccordionExample />} />
            
            {/* 어드민 페이지 */}
            <Route path="admin" element={<PermissionStore><AdminNav /></PermissionStore>}>
              <Route path="auth" element={<PermissionMain />} />
            </Route>
            
            {/* 게시판 (text Board) */}
            <Route path="post" element={<TextStore><PostLayout /></TextStore>}>
              <Route path="list" element={<PostListMain />} />
              <Route path="detail/:id" element={<PostItemMain />} />
            </Route>
            <Route path='auth/oauth-response/:token/:expirationTime' element={<OAuth/>}/>
            {/* 결제 관련 페이지 */}
            <Route path="checkoutPage" element={<CheckoutPage />} />
            <Route path="sandbox/success" element={<SuccessPage />} />
            <Route path="checkoutPage/fail" element={<FailPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
