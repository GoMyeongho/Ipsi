import styled from "styled-components";
import TopNavBar from "../component/TopNavBar"
import { Outlet } from 'react-router-dom';

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  width: 100%;
  height: 100px;
`

const Layout = () => {
  return(
   <>
      <Background>
        <Header>
          <TopNavBar/>
        </Header>
        <Outlet/>
      </Background>
   </> 
  )
}

export default Layout