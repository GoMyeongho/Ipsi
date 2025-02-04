import React, {useContext, useState} from 'react';
import { styled } from 'styled-components';
import {TextField, IconButton} from '@mui/material';
import { Search } from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {Dropdown} from "../../../../styles/SmallComponents";
import RejectModal from "../../../../component/Modal/RejectModal";
import {PermissionContext} from "../../../../context/admin/PermissionStore";

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
	width: 40%;
`

const ControlListHeader = () => {
	const { searchQuery, setSearchQuery, searchOption, setSearchOption } = useContext(PermissionContext);
	const navigate = useNavigate();
	const [reject, setReject] = useState(false);
	const [error, setError] = useState("");
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
		navigate(`/admin/member/${searchQuery}/${searchOption}`);
	};
	
	
	const onChangeSearchOption = (event) => {
		setSearchOption(event.target.value);
	}
	
	const onChangeSearchQuery = (event) => {
		setSearchQuery(event.target.value);
	}
	
	
	const searchOptions =  [
		{value: "univName", label: "대학"},
		{value: "authority", label: "권한"},
	]
	const searchQuerys =  [
		{value: "ROLE_USER", label: "일반 회원"},
		{value: "ROLE_UNIV", label: "대학생 회원"},
		{value: "ROLE_ADMIN", label: "관리자"},
		{value: "REST_USER", label: "휴면 회원"},
	]
	
	return (
		<HeaderContainer>
			<Title>회원 조회</Title>
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
				{searchOption === "authority" ?
					<DropdownContainer>
						<Dropdown value={searchQuery} onChange={onChangeSearchQuery}>
							<option value={""}>검색 범위</option>
							{searchQuerys.map((search, index) => (
								<option key={index} value={search.value}>
									{search.label}
								</option>
							))}
						</Dropdown>
						<IconButton onClick={onSearchClick}><SearchIcon/></IconButton>
					</DropdownContainer>
					:
					<SearchContainer>
					<TextField
						placeholder="검색어 입력"
						variant="standard"
						value={searchQuery}
						onChange={onSearchChange}
						sx={{flexGrow: 1}}
					/>
					<IconButton onClick={onSearchClick}><SearchIcon/></IconButton>
				</SearchContainer>}
			</RightContainer>
			<RejectModal open={reject} message={error} onClose={() => setReject(false)}></RejectModal>
		</HeaderContainer>
	);
};

export default ControlListHeader;
