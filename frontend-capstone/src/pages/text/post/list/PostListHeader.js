import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { TextContext } from "../../../../context/TextStore";

// 전체 컨테이너 스타일링
const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    padding: 0 20px;
    width: 100%;
`;

// 왼쪽 제목
const Title = styled.div`
    font-size: 24px;
    font-weight: bold;
`;

// 검색 입력 스타일링
const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 5px 15px;
    border-radius: 50px;
    margin-right: 20px;
    min-width: 250px;
`;

// 검색 아이콘
const SearchIcon = styled(Search)`
    color: #757575;
    margin-right: 10px;
`;

// 오른쪽 컨테이너
const RightContainer = styled.div`
    display: flex;
    align-items: center;
`;

// 드롭다운 스타일링
const DropdownContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 20px;
    padding: 5px 15px;
`;

const PostListHeader = () => {
	const { searchQuery, setSearchQuery, sortOption, setSortOption } = useContext(TextContext);
	const navigate = useNavigate();
	
	// 검색어 변경
	const onSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};
	
	// 검색 버튼 클릭
	const onSearchClick = () => {
		navigate(`/list/${searchQuery}/${sortOption}`);
	};
	
	// 정렬 옵션 변경
	const onSortChange = (event) => {
		setSortOption(event.target.value);
	};
	
	return (
		<HeaderContainer>
			<Title>게시판</Title>
			<RightContainer>
				{/* 검색 입력 */}
				<SearchContainer>
					<SearchIcon />
					<TextField
						placeholder="검색어 입력"
						variant="standard"
						InputProps={{ disableUnderline: true }}
						value={searchQuery}
						onChange={onSearchChange}
						fullWidth
					/>
					<Button onClick={onSearchClick}>검색</Button>
				</SearchContainer>
				
				{/* 드롭다운 */}
				<DropdownContainer>
					<FormControl fullWidth variant="standard">
						<InputLabel>정렬 옵션</InputLabel>
						<Select
							value={sortOption}
							onChange={onSortChange}
							label="정렬 옵션"
						>
							<MenuItem value="desc">최신순</MenuItem>
							<MenuItem value="asc">오래된순</MenuItem>
						</Select>
					</FormControl>
				</DropdownContainer>
			</RightContainer>
		</HeaderContainer>
	);
};

export default PostListHeader;
