import React from 'react';
import { IconButton, Box } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, FirstPage, LastPage } from '@mui/icons-material';

const PageComponent = ({ maxPage, currentPage, setCurrentPage }) => {
	const [visiblePageRange, setVisiblePageRange] = React.useState([1, 5]);
	
	const handlePageClick = (page) => {
		setCurrentPage(page);
	};
	
	const handleFirstPageClick = () => {
		setCurrentPage(0); // 0부터 시작
		setVisiblePageRange([1, 5]);
	};
	
	const handleNextPageClick = () => {
		if (currentPage < maxPage - 1) {
			setCurrentPage(currentPage + 1);
		}
	};
	
	const handlePrevPageClick = () => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - 1);
		}
	};
	
	const handleNextPageRangeClick = () => {
		if (visiblePageRange[1] < maxPage) {
			setVisiblePageRange([visiblePageRange[1] + 1, visiblePageRange[1] + 5]);
			setCurrentPage(visiblePageRange[1]);
		}
	};
	
	const handlePrevPageRangeClick = () => {
		if (visiblePageRange[0] > 1) {
			setVisiblePageRange([visiblePageRange[0] - 5, visiblePageRange[0] - 1]);
			setCurrentPage(visiblePageRange[0] - 1);
		}
	};
	
	return (
		<Box display="flex" alignItems="center" justifyContent="center" my={2}>
			{/* 맨 처음으로 가는 버튼 */}
			<IconButton
				onClick={handleFirstPageClick}
				disabled={currentPage === 0}
				sx={{
					width: 30, // 크기 조정
					height: 30, // 크기 조정
				}}
			>
				<FirstPage sx={{ fontSize: 30 }} /> {/* 아이콘 크기 조정 */}
			</IconButton>
			
			{/* 전 페이지로 가는 버튼 */}
			<IconButton
				onClick={handlePrevPageClick}
				disabled={currentPage === 0}
				sx={{
					width: 30, // 크기 조정
					height: 30, // 크기 조정
				}}
			>
				<ArrowBackIosNew sx={{ fontSize: 20 }} /> {/* 아이콘 크기 조정 */}
			</IconButton>
			
			{/* 페이지 버튼 */}
			{Array.from({ length: maxPage }, (_, index) => (
				index >= visiblePageRange[0] - 1 && index < visiblePageRange[1] && (
					<IconButton
						key={index}
						onClick={() => handlePageClick(index)}
						sx={{
							backgroundColor: currentPage === index ? '#ECE1FF' : 'transparent',
							width: 30, // 크기 조정
							height: 30, // 크기 조정
						}}
					>
						{index + 1}
					</IconButton>
				)
			))}
			
			{/* 다음 페이지로 가는 버튼 */}
			<IconButton
				onClick={handleNextPageRangeClick}
				disabled={currentPage >= maxPage - 1}
				sx={{
					width: 30, // 크기 조정
					height: 30, // 크기 조정
				}}
			>
				<ArrowForwardIos sx={{ fontSize: 20 }} /> {/* 아이콘 크기 조정 */}
			</IconButton>
			
			{/* 다음 페이지 리스트로 가는 버튼 */}
			<IconButton
				onClick={handleNextPageRangeClick}
				disabled={visiblePageRange[1] >= maxPage}
				sx={{
					width: 30, // 크기 조정
					height: 30, // 크기 조정
				}}
			>
				<LastPage sx={{ fontSize: 30 }} /> {/* 아이콘 크기 조정 */}
			</IconButton>
		</Box>
	);
};

export default PageComponent;
