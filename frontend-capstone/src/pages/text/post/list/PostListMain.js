import React, { useState, useEffect, useContext } from "react";
import { Box } from "@mui/material";
import { TextContext } from "../../../../context/TextStore";
import TextBoardApi from "../../../../api/TextBoardApi";
import SortTable from "../../../../component/SortTable";
import PageComponent from "../../../../component/PageComponent";
import TextListComponent from "../../../../component/TextListCompomnent";

const PostListMain = () => {
	const { size, page, postList, setPostList, maxPage, setMaxPage } = useContext(TextContext);
	const [currentPage, setCurrentPage] = useState(page);
	
	
	useEffect(() => {
		const fetchMaxPage = async () => {
			try {
				const rsp = await TextBoardApi.getAllTextBoardPage("default", size);
				setMaxPage(rsp.data);
			} catch (error) {
				console.error("Error fetching max page:", error);
			}
		};
		fetchMaxPage();
	}, [size]);
	
	useEffect(() => {
		const fetchPostList = async () => {
			try {
				const rsp = await TextBoardApi.getAllTextBoardList("default", currentPage, size);
				setPostList(rsp.data);
			} catch (error) {
				console.error("Error fetching post list:", error);
			}
		};
		fetchPostList();
	}, [currentPage, size]);
	
	return (
		<Box sx={styles.container}>
			<TextListComponent list={postList} />
			<PageComponent
				maxPage={maxPage}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
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
