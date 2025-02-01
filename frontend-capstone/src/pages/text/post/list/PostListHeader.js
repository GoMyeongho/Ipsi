import React, {useContext, useState} from 'react';
import { styled } from 'styled-components';
import {TextField, Select, MenuItem, InputLabel, FormControl, Button, IconButton} from '@mui/material';
import { Search } from '@mui/icons-material';
import {useNavigate, useParams} from 'react-router-dom';
import { TextContext } from "../../../../context/TextStore";
import {Dropdown} from "../../../../styles/SmallComponents";
import RejectModal from "../../../../component/Modal/RejectModal";

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
    min-width: 200px;
		width: 60%;
		flex-grow: 1;
`;

// 검색 아이콘
const SearchIcon = styled(Search)`
    color: #757575;
`;

// 오른쪽 컨테이너
const RightContainer = styled.div`
    display: flex;
    align-items: center;
    min-width: 500px;
		width: 60%;
`;

const DropdownContainer = styled.div`
	display: flex;
	width: 20%;
`
export const categoryTitle =[
	{value: "faq", label: "FAQ"},
	{value: "default", label: "게시판"},
	{value: "review", label: "이용후기"},
]

const PostListHeader = () => {
	const { searchQuery, setSearchQuery, searchOption, setSearchOption, sortOption, setSortOption, setPage } = useContext(TextContext);
	const navigate = useNavigate();
	const [reject, setReject] = useState(false);
	const [error, setError] = useState("");
	const {category} = useParams()
	// 검색어 변경
	const onSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};
	// 검색 버튼 클릭
	const onSearchClick = () => {
		if (searchOption === null || searchOption === "") {
			setError("검색 조건이 선택되지 않았습니다.")
			setReject(true);
			return
		}
		if (searchQuery === null || searchQuery === "") {
			setError("검색창에 아무값도 없습니다.")
			setReject(true);
			return;
		}
		navigate(`/post/list/${category}/${searchQuery}/${searchOption}`);
	};
	
	// 정렬 옵션 변경
	const onSortChange = (event) => {
		setSortOption(event.target.value);
		setPage(0);
	};
	
	const onChangeSearchOption = (event) => {
		setSearchOption(event.target.value);
	}
	
	const sortOptions = [
		{value: 'desc', label: '최신순'},
		{value: 'asc', label: '오래된순'},
	]
	const searchOptions = (category !== "faq") ? [
		{value: "title", label: "제목"},
		{value: "nickName", label: "작성자"},
		{value: "titleAndContent", label: "제목 + 내용"},
	] : [
		{value: "title", label: "제목"},
		{value: "titleAndContent", label: "제목 + 내용"},
	]
	
	
	return (
		<HeaderContainer>
			<Title>{categoryTitle.find(title => title.value === category)?.label || "기본 제목"}</Title>
			<RightContainer>
				{/* 드롭다운 */}
				<DropdownContainer>
					<Dropdown value={searchOption} onChange={onChangeSearchOption}>
						<option value={""}>검색 범위</option>
						{searchOptions.map((search, index) => (
							<option key={index} value={search.value}>
								{search.label}
							</option>
						))}
					</Dropdown>
				</DropdownContainer>
				{/* 검색 입력 */}
				<SearchContainer>
					<TextField
						placeholder="검색어 입력"
						variant="standard"
						value={searchQuery}
						onChange={onSearchChange}
						sx = {{flexGrow: 1}}
					/>
					<IconButton onClick={onSearchClick}><SearchIcon/></IconButton>
				</SearchContainer>
				{/* 드롭다운 */}
				<DropdownContainer>
					<Dropdown value={sortOption} onChange={onSortChange}>
						<option value="">정렬 순서</option>
						{sortOptions.map((sort, index) => (
							<option key={index} value={sort.value}>
								{sort.label}
							</option>
						))}
					</Dropdown>
				</DropdownContainer>
			</RightContainer>
			<RejectModal open={reject} message={error} onClose={() => setReject(false)}></RejectModal>
		</HeaderContainer>
	);
};

export default PostListHeader;
