import styled from "styled-components";
import TopNavBar from "../component/TopNavBar"
import ChatModal from "../pages/chat/ChatModal";

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  width: 100%;
  height: 100px;
  position: relative;
  z-index: 1000;
`

const Layout = () => {
  return(
   <>
      <Background>
        <Header>
          <TopNavBar/>
        </Header>
        <ChatModal/>
      </Background>
   </>
  )
}

export default Layout