import React, { useEffect, useState, useContext } from "react";
import { Box } from "@mui/material";
import {  useNavigate, useParams } from "react-router-dom";
import { TextContext } from "../../../../context/TextStore"; // context 사용
import TextBoardApi from "../../../../api/TextBoardApi";

import PageComponent from "../../../../component/PageComponent";
import TextListComponent from "../../../../component/TextListCompomnent";
import PostListHeader from "./PostListHeader";

const PostListMain = () => {
	// context에서 상태 가져오기
	const { size, page, setPage, postList, setPostList, maxPage, setMaxPage, setSearch, setSearchOption } = useContext(TextContext);
	
	// const navigate = useNavigate();
	const { category, search, searchOption } = useParams(); // URL 파라미터에서 검색어와 검색옵션 가져오기
	
	// URL에서 search와 searchOption을 추출하고, context 상태를 업데이트
	useEffect(() => {
		if (search) {
			setSearch(search); // 상태 업데이트
		}
		if (searchOption) {
			setSearchOption(searchOption); // 상태 업데이트
		}
	}, [search, searchOption, setSearch, setSearchOption]);
	
	// 페이지와 검색어에 따라 MaxPage 요청
	useEffect(() => {
		const fetchMaxPage = async () => {
			try {
				const rsp = searchOption
					? searchOption === "title"
						? await TextBoardApi.getAllTextBoardPageByTitle(search, category, size)
						: searchOption === "nickName"
							? await TextBoardApi.getAllTextBoardPageByNickName(search, category, size)
							: await TextBoardApi.getAllTextBoardPageByTitleOrContent(search, category, size)
					: await TextBoardApi.getAllTextBoardPage(category, size);
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
						? await TextBoardApi.getAllTextBoardListByTitle(search, category, page, size, "desc")
						: searchOption === "nickName"
							? await TextBoardApi.getAllTextBoardListByNickName(search, category, page, size, "desc")
							: await TextBoardApi.getAllTextBoardListByTitleOrContent(search, category, page, size, "desc")
					: await TextBoardApi.getAllTextBoardList(category, page, size, "desc");
				console.log(rsp);
				setPostList(rsp.data);
			} catch (error) {
				console.error("Error fetching post list:", error);
			}
		};
		fetchPostList();
	}, [page, size, search, category, setPostList]);
	
	
	
	return (
		<Box sx={styles.container}>
			<PostListHeader  />
			<TextListComponent list={postList} />
			<PageComponent
				maxPage={maxPage}
				currentPage={page}
				setCurrentPage={setPage}
			/>
		</Box>
	);
};

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "20px",
	},
};

export default PostListMain;
