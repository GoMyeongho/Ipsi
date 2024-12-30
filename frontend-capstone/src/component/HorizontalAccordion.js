import React from "react";
import { Box, Typography } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";

const HorizontalAccordion = ({
	                             name, // 칩에 표시될 텍스트
	                             id, // 아코디언의 고유 ID
	                             visible, // 아코디언 열림/닫힘 상태를 저장하는 객체
	                             setVisible, // 열림/닫힘 상태를 변경하는 함수
	                             children, // 아코디언의 내용
	                             style = {}, // 스타일을 오버라이드 할 수 있는 객체
	                             collapsedWidth = "100px", // 닫혔을 때의 기본 너비 (기본값: "100px")
	                             expandedWidth = "400px", // 펼쳐졌을 때의 기본 너비 (기본값: "400px")
	                             direction = "right", // 아코디언이 펼쳐지는 방향 ('right' 또는 'left', 기본값: "right")
	                             reversed = false, // 아이콘의 방향을 반전시킬지 여부 (기본값: false)
	                             height = "auto", // 높이를 설정할 수 있는 옵션 (기본값: "auto")
                             }) => {
	const isExpanded = visible[id]; // 해당 아코디언의 현재 열림/닫힘 상태 확인
	
	// 방향에 따른 아이콘 설정
	const toggleIcon =
		direction === "right" ? (
			isExpanded ? (
				reversed ? (
					<ArrowForwardIos sx={{ fontSize: "1.125em" }} />
				) : (
					<ArrowBackIos sx={{ fontSize: "1.125em" }} />
				)
			) : reversed ? (
				<ArrowBackIos sx={{ fontSize: "1.125em" }} />
			) : (
				<ArrowForwardIos sx={{ fontSize: "1.125em" }} />
			)
		) : isExpanded ? (
			reversed ? (
				<ArrowBackIos sx={{ fontSize: "1.125em" }} />
			) : (
				<ArrowForwardIos sx={{ fontSize: "1.125em" }} />
			)
		) : reversed ? (
			<ArrowForwardIos sx={{ fontSize: "1.125em" }} />
		) : (
			<ArrowBackIos sx={{ fontSize: "1.125em" }} />
		);
	
	// Summary 부분 클릭 시 열리고 닫히는 함수
	const handleSummaryClick = () => setVisible({ ...visible, [id]: !isExpanded });
	
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: direction === "right" ? "row" : "row-reverse", // 'right'일 때 기본, 'left'이면 반대로 설정
				overflow: "hidden", // 자식 요소가 Box 영역을 넘어가지 않도록 설정
				transition: "width 0.3s ease-in-out", // width 애니메이션 설정
				width: isExpanded ? expandedWidth : collapsedWidth, // 아코디언이 펼쳐졌을 때와 닫혔을 때 너비 설정
				height: height, // 높이 설정 (기본값: "auto")
				border: "1px solid #ddd", // 아코디언의 테두리 설정
				borderRadius: "8px", // 둥근 모서리 설정
				backgroundColor: "#f9f9f9", // 배경색 설정
				...style.container, // 외부에서 전달된 스타일을 적용
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column", // 아이콘과 텍스트가 세로로 정렬되도록 설정
					alignItems: "center", // 중앙 정렬
					justifyContent: "center", // 수직 중앙 정렬
					padding: "8px",
					textAlign: "center", // 텍스트 수평 중앙 정렬
					width: collapsedWidth, // Summary의 너비는 collapsed 상태에 맞춤
					height: height, // Summary의 높이를 고정
					backgroundColor: "#fff", // 배경색 설정
					borderLeft:
						direction === "left" && isExpanded ? "1px solid #ddd" : "none", // 'left' 방향일 때만 왼쪽에 테두리 설정
					borderRight:
						direction === "right" && isExpanded ? "1px solid #ddd" : "none", // 'right' 방향일 때만 오른쪽에 테두리 설정
					cursor: "pointer", // 클릭 가능하도록 커서 모양 변경
					...style.summary, // 외부에서 전달된 스타일을 적용
				}}
				onClick={handleSummaryClick}
			>
				<Typography
					variant="body2"
					sx={{
						writingMode: "vertical-rl", // 글자 방향을 위에서 아래로 설정
						...style.typography, // 외부에서 전달된 텍스트 스타일을 적용
					}}
				>
					{name}
				</Typography>
				<Box sx={{ marginTop: "0.5em" }}>{toggleIcon}</Box>
			</Box>
			
			{/* 아코디언이 펼쳐졌을 때만 내용이 보이도록 설정 */}
			{isExpanded && (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						flexGrow: 1, // 남는 공간을 채우도록 설정
						padding: "8px",
						opacity: 1, // 펼쳐질 때 바로 opacity를 1로 설정
						transition: "opacity 0.3s ease-in-out", // opacity 애니메이션 설정
						...style.details, // 외부에서 전달된 스타일을 적용
					}}
				>
					{children} {/* 아코디언 안에 들어갈 내용 */}
				</Box>
			)}
		</Box>
	);
};

export default HorizontalAccordion;
