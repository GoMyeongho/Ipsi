import './App.css';
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
// import ChatList from './pages/chat/ChatList';
// import ChatRoomCreate from './pages/chat/ChatRoomCreate';
// import Chatting from './pages/chat/Chatting';

function App() {
  return (
    <>
      <GlobalStyle/>
      <Router>
        <Routes>
          <Route path='/login' element={<TestLogin/>}></Route>
          <Route path='/' element={<Layout/>}>
            <Route path='/coverLetter' element={<CoverLetter/>}/>
            <Route path='/test/modal' element={<ModalExample/>}/>
            <Route path='/test/accordion' element={<AccordionExample/>}/>
            {/*<Route path='/chat' element={<ChatList />} />*/}
            {/*<Route path='/chat-create' element={<ChatRoomCreate />}/>*/}
            {/*<Route path='/chatting/:roomId' element={<Chatting />}/>*/}
            <Route path="/admin" element={<PermissionStore><AdminNav/></PermissionStore>}>
              <Route path="auth" element={<PermissionMain/>}/>
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
