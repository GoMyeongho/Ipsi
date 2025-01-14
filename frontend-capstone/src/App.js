
import './style.css';
import { CheckoutPage } from './paySystem/CheckOut';
import { FailPage } from './paySystem/Fail';
import { SuccessPage } from './paySystem/Success';
import CoverLetter from './pages/CoverLetter';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './styles/Layout';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ModalExample from "./example/ModalExample";
import AccordionExample from "./example/AccordionExample";
import AdminNav from "./pages/admin/AdminNav";
import PermissionMain from "./pages/admin/auth/list/PermissionMain";
import PermissionStore from "./context/admin/PermissionStore";
import TestLogin from "./pages/auth/login/TestLogin";
import ChatStore from './context/ChatStore';
import TextStore, {PostLayout} from "./context/TextStore";
import PostListMain from "./pages/text/post/list/PostListMain";
import PostItemMain from "./pages/text/post/item/PostItemMain";


function App() {
  return (
    <>
      <GlobalStyle/>
      <Router>
        <Routes>
          <Route path='/login' element={<TestLogin/>}></Route>
          <Route path='/' element={<ChatStore><Layout/></ChatStore>}>
            <Route path='/coverLetter' element={<CoverLetter/>}/>
            <Route path='/test/modal' element={<ModalExample/>}/>
            <Route path='/test/accordion' element={<AccordionExample/>}/>
            {/*<Route path='/chat' element={<ChatList />} />*/}
            {/* <Route path='/chat-create' element={<ChatRoomCreate />}/> */}
            {/*<Route path='/chatting/:roomId' element={<Chatting />}/>*/}
            {/*text Board 페이지*/}
            <Route path="/post" element={<TextStore><PostLayout/></TextStore>}>
              <Route path="list" element={<PostListMain/>}/>
              <Route path="detail/:id" element={<PostItemMain/>}/>
            </Route>
            {/*어드민 페이지*/}
            <Route path="/admin" element={<PermissionStore><AdminNav/></PermissionStore>}>
              <Route path="auth" element={<PermissionMain/>}/>
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
