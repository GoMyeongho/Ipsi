
import React, { useState } from 'react';
import styled from 'styled-components';

// 페이지 버튼 스타일
const PageButton = styled.button`
  border-radius: 50%;
  background-color: ${(props) => (props.active ? '#9b71e3' : 'transparent')};
  border: ${(props) => (props.active ? 'none' : '1px solid #9b71e3')};
  padding: 15px;
  margin: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  
  &:hover {
    background-color: ${(props) => (props.active ? '#9b71e3' : '#c58dd5')};
  }

  &:focus {
    outline: none;
  }
`;

const NavigationButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 18px;
  margin: 5px;
  cursor: pointer;
  color: #9b71e3;
  
  &:hover {
    color: #7a57b4;
  }
`;

const Pagination = ({ totalPages }) => {
	const [selectedPage, setSelectedPage] = useState(1); // 기본 페이지 1
	const [visiblePageRange, setVisiblePageRange] = useState([1, 5]); // 처음 보이는 페이지 범위 설정
	
	const handlePageClick = (page) => {
		setSelectedPage(page);
	};
	
	const handleFirstPageClick = () => {
		setSelectedPage(1);
		setVisiblePageRange([1, 5]); // 맨 처음 페이지로 가면 페이지 리스트를 초기화
	};
	
	const handleNextPageClick = () => {
		if (selectedPage < totalPages) {
			setSelectedPage(selectedPage + 1);
		}
	};
	
	const handlePrevPageClick = () => {
		if (selectedPage > 1) {
			setSelectedPage(selectedPage - 1);
		}
	};
	
	const handleNextPageRangeClick = () => {
		if (visiblePageRange[1] < totalPages) {
			setVisiblePageRange([visiblePageRange[1] + 1, visiblePageRange[1] + 5]);
			setSelectedPage(visiblePageRange[1] + 1);
		}
	};
	
	const handlePrevPageRangeClick = () => {
		if (visiblePageRange[0] > 1) {
			setVisiblePageRange([visiblePageRange[0] - 5, visiblePageRange[0] - 1]);
			setSelectedPage(visiblePageRange[0] - 1);
		}
	};
	
	return (
		<div>
			<div>
				{/* 맨 처음으로 가는 버튼 */}
				<NavigationButton onClick={handleFirstPageClick}>&#171;</NavigationButton>
				
				{/* 전 페이지로 가는 버튼 */}
				<NavigationButton onClick={handlePrevPageClick}>&#8249;</NavigationButton>
				
				{/* 페이지 버튼 */}
				{Array.from({ length: totalPages }, (_, index) => (
					(index + 1 >= visiblePageRange[0] && index + 1 <= visiblePageRange[1]) && (
						<PageButton
							key={index + 1}
							active={selectedPage === index + 1}
							onClick={() => handlePageClick(index + 1)}
						>
							{index + 1}
						</PageButton>
					)
				))}
				
				{/* 다음 페이지 리스트로 가는 버튼 */}
				<NavigationButton onClick={handleNextPageRangeClick}>&#187;</NavigationButton>
				
				{/* 다음 페이지로 가는 버튼 */}
				<NavigationButton onClick={handleNextPageClick}>&#8250;</NavigationButton>
			</div>
		</div>
	);
};

export default Pagination;
