import styled from "styled-components";

const Background = styled.div`
  width: 100%;
  height: 100px;
  top: 0;
  left: 0;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;

`

const Left = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* img 태그 스타일링 */
  img {
    width: 30%;
    cursor: pointer;
  }

  /* p 태그 스타일링 */
  p {
    display: flex;
    justify-content: center;
    width: 20%;
    font-weight: bold;
    cursor: pointer;
  }

`

const Right = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  /* img 태그 스타일링 */
  img {
    width: 50%;
    cursor: pointer;
  }
`

const TopNavBar = () => {
  
  return(
    <>
      <Background>
        <Left>
          <img src="https://firebasestorage.googleapis.com/v0/b/photo-island-eeaa3.firebasestorage.app/o/KH_Comprehensive_Project%2Fipsi%20Logo.png?alt=media&token=5bf92de0-1097-4148-9546-c1ed3bb887a6"
               alt="Logo"
          />
          <p>입시자료</p>
          <p>자소서 작성</p>
          <p>게시판</p>
          <p>이용후기</p>
        </Left>
        <Right>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/photo-island-eeaa3.firebasestorage.app/o/KH_Comprehensive_Project%2FProfile.png?alt=media&token=a5366590-064f-4b63-af8a-cb3ca2e83fc2"
            alt="Profile"
            // onClick={}
          />
        </Right>      
      </Background>
    </>
  );
}

export default TopNavBar;