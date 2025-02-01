import styled from "styled-components";
import TopNavBar from "../component/TopNavBar";
import ChatModal from "../pages/chat/ChatModal";
import MobileTopNavBar from "../component/MobileTopNavBar";
import {useContext, useEffect} from "react";
import AuthApi from "../api/AuthApi";
import {useDispatch, useSelector} from "react-redux";
import {logout, setAccessToken, setRefreshToken, setRole} from "../context/redux/PersistentReducer";



const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  width: 100%;
  height: 100px;
  position: relative;
  z-index: 1000;
`;

const PC = styled.div`

  @media (max-width: 768px) {
    display: none;
  }
`;

const Mobile = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
  }
`;


const Layout = () => {
  const accessToken = useSelector((state) => state.persistent.accessToken);
  const refreshToken = useSelector((state) => state.persistent.refreshToken);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUserStatus = async () => {
      try{
        console.log("유저정보 패치")
        const rsp = await AuthApi.IsLogin();
        if(rsp)
        {
          console.log(rsp);
          dispatch(setRole(rsp.data))
          return
        }
        dispatch(logout())
      } catch (error) {
        console.log(error);
        dispatch(logout())
      }
    }
    fetchUserStatus();
  }, [dispatch, accessToken, refreshToken]);
  
  
  
  return (
    <Background>
      <Header>
        <PC>
          <TopNavBar/>
        </PC>
        <Mobile>
          <MobileTopNavBar/>
        </Mobile>
      </Header>
      <ChatModal />
    </Background>
  );
};

export default Layout;
