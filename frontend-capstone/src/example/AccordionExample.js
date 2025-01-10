import styled from "styled-components";
import AccordionComponent from "../component/AccordionComponent";
import {useState} from "react";
import HorizontalAccordion from "../component/HorizontalAccordion";

const Container = styled.div`
		width: 80%;
		position: relative;
		margin: 10px auto;
		height: 1000px;
		display: flex;
		flex-direction: column;
`

const AccordionLast = styled.div`
		width: 80%;
	position: fixed;
		bottom: 0;
`

const AccordionLeft = styled.div`
	position: absolute;
		top: 250px;
		right: 0;
`

const AccordionRight = styled.div`
	position: absolute;
		top: 450px;
		right: 0;
`

const AccordionExample = () => {
	const [visible, setVisible] = useState({});
	
	const style = {
		accordion: {
			width: "500px", // 전체 아코디언의 너비
			backgroundColor: "transparent", // 전체 배경을 투명하게 설정
			boxShadow: "none", // 그림자 없애기
			border: "none", // 테두리 없애기
			"&::before": {
				display: "none", // 아코디언 맨 위 줄을 안보이기 위해서
			},
		},
		accordionSummary: {
			boxShadow: "none", // 그림자 없애기
			width: "120px", // Summary는 너비가 100% 차지하도록
			backgroundColor: "lightblue", // 헤더 배경색
			borderRadius: "60px", // 헤더 모서리 둥글게 처리
			height: "120px", // 헤더 높이 설정
			margin: "0 auto 50px", // 중앙 정렬
			cursor: "pointer", // 커서가 손 모양으로 변경되도록
			"&:hover": { // 헤더 hover 시 색상 변경
				backgroundColor: "deepskyblue",
			},
		},
		typography: {
			fontWeight: "bold",
		},
		divider: {
			// divider 에 before, after 를 추가하는 방법
			// 칩이 가운데에 있기 때문에 before와 after로 구현
			// position: "relative", // before, after의 위치 설정
			"&::before": {
				border: "1px solid aquamarine", // 줄 색상
			},
			"&::after": {
				border: "1px solid deepskyblue", // 줄 색상
			},
		},
		chip:{
			backgroundColor: "bisque"
		},
		accordionDetails: {
			boxShadow: "none",
			backgroundColor: "#f9f9f9", // 내용 배경색
			padding: "10px", // 패딩 추가
		},
	};
	
	return(
		<Container>
			<AccordionComponent visible={visible} setVisible={setVisible}
			                    name="name의 위치입니다." id="basic"
			                    label="label이 표기되는 자리입니다.">
				test 내용입니다.
			</AccordionComponent>
			<AccordionComponent visible={visible} setVisible={setVisible}
			                    name="두번째 아코디언 입니다." id="second"
			                    label="두번째 라벨입니다.">
				붙여서 쓰는 경우입니다.
			</AccordionComponent>
			<AccordionComponent visible={visible} setVisible={setVisible}
			                    name="스타일" id="style"
			                    label="두번째 라벨입니다."
			                    style={style}>
				스타일 적용 사례입니다.
			</AccordionComponent>
			<HorizontalAccordion visible={visible} setVisible={setVisible}
			                     name="name의 위치입니다." id="right">
				test 내용입니다.
			</HorizontalAccordion>
			
			<AccordionLeft>
				<HorizontalAccordion visible={visible} setVisible={setVisible}
				                     name="name의 위치입니다." id="left"
				                     direction="left">
					test 내용입니다.
				</HorizontalAccordion>
			</AccordionLeft>
			<AccordionRight>
				<HorizontalAccordion visible={visible} setVisible={setVisible}
				                     name="name의 위치입니다."
				                     reversed={true} id="1">
					test 내용입니다.
				</HorizontalAccordion>
			</AccordionRight>
			
			<AccordionLast>
				<AccordionComponent visible={visible} setVisible={setVisible}
				                    name="왼쪽" reversed={true} id='3'
				                    label="이어서 Accordion을 쓰면 붙으니 따로 떨어트려 놔야 합니다.">
					반대로 올리는 경우 사용하는 아코디언입니다.
				</AccordionComponent>
			</AccordionLast>
		</Container>
	)
}
export default AccordionExample;