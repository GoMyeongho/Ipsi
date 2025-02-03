import React, {useEffect, useContext, useState} from "react";
import {Box, IconButton, Tooltip} from "@mui/material";
import {  useNavigate , useParams } from "react-router-dom";
import CreateIcon from '@mui/icons-material/Create';
import { TextContext } from "../../../../context/TextStore"; // context 사용
import TextBoardApi from "../../../../api/TextBoardApi";
import PageComponent from "../../../../component/PageComponent";
import TextListComponent from "../../../../component/TextListCompomnent";
import PostListHeader from "./PostListHeader";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import ConfirmModal from "../../../../component/Modal/ConfirmModal";
import {setLoginModalOpen} from "../../../../context/redux/ModalReducer";

const PostListMain = ({active}) => {
	// context에서 상태 가져오기
	const { size, page, setPage, postList, setPostList, maxPage, setMaxPage, setSearchQuery, setSearchOption, sortOption } = useContext(TextContext);
	const navigator = useNavigate();
	const { category, search, searchOption } = useParams(); // URL 파라미터에서 검색어와 검색옵션 가져오기
	const role = useSelector(state => state.persistent.role);
	const [confirm, setConfirm] = useState({});
	const dispatch = useDispatch();

	// URL에서 search와 searchOption을 추출하고, context 상태를 업데이트
	useEffect(() => {
		if (search) {
			setSearchQuery(search); // 상태 업데이트
		}
		if (searchOption) {
			setSearchOption(searchOption); // 상태 업데이트
		}
	}, [search, searchOption]);
	
	// 페이지와 검색어에 따라 MaxPage 요청
	useEffect(() => {
		const fetchMaxPage = async () => {
			try {
				const rsp = searchOption
					? searchOption === "title"
						? await TextBoardApi.getAllTextBoardPageByTitle(search, category, size, active)
						: searchOption === "nickName"
							? await TextBoardApi.getAllTextBoardPageByNickName(search, category, size, active)
							: searchOption === "member" ?
								await TextBoardApi.getAllTextBoardPageByMember(search, category, size, active)
								:await TextBoardApi.getAllTextBoardPageByTitleOrContent(search, category, size, active)
					: await TextBoardApi.getAllTextBoardPage(category, size, active);
				setMaxPage(rsp.data);
			} catch (error) {
				console.error("Error fetching max page:", error);
			}
		};
		fetchMaxPage();
		
	}, [size, search, category, setMaxPage]);

// 페이지와 검색어에 따라 게시글 목록 요청
	useEffect(() => {
		const fetchPostList = async () => {
			try {
				const rsp = searchOption
					? searchOption === "title"
						? await TextBoardApi.getAllTextBoardListByTitle(search, category, page, size, active, sortOption || "desc")
						: searchOption === "nickName"
							? await TextBoardApi.getAllTextBoardListByNickName(search, category, page, size, active, sortOption || "desc")
							: searchOption === "member" ?
								await  TextBoardApi.getAllTextBoardListByMember(search, category, page, size, active, sortOption || "desc")
								:await TextBoardApi.getAllTextBoardListByTitleOrContent(search, category, page, size, active, sortOption || "desc")
					: await TextBoardApi.getAllTextBoardList(category, page, size, active, sortOption || "desc");
				console.log(rsp);
				setPostList(rsp.data);
			} catch (error) {
				console.error("Error fetching post list:", error);
			}
		};
		fetchPostList();
		return(
			setPostList(null)
		)
	}, [page, size, search, category, setPostList, sortOption]);
	
	const onClickCreate = () => {
		if(role !== null && role !== "REST_USER") {
			navigator(`/post/create/${category}`)// 글작성 페이지로 이동
		}
		else {
			setConfirm({value : true, label : "로그인 후에 가능한 서비스 입니다.\n로그인 하시겠습니까?"
				, onConfirm: () => {
				dispatch(setLoginModalOpen(true));
				setConfirm({})
			}});
		}
	}
	
	return (
		<Box sx={styles.container}>
			<PostListHeader  />
			<TextListComponent list={postList} />
			<PageComponent
				maxPage={maxPage}
				currentPage={page}
				setCurrentPage={setPage}
			/>
			{
				(category !== "faq" || role === "ROLE_ADMIN") &&
				<ButtonContainer>
					<div></div>
					<Tooltip title="글 작성">
						<IconButton onClick={onClickCreate}>
							<CreateIcon/>
						</IconButton>
					</Tooltip>
				</ButtonContainer>
			}
			<ConfirmModal onConfirm={confirm.onConfirm} message={confirm.label} open={confirm.value} onCancel={() => setConfirm({})}/>
		</Box>
	);
};

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "20px",
		position: "relative",
		width: "100%",
	},
};

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	position: relative;
	width: 100%;
	margin-right: 30px;
`


export default PostListMain;
