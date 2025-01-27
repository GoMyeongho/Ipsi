import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Box, Paper, Typography} from "@mui/material";
import TextBoardApi from "../../../../api/TextBoardApi";


const PostItemMain = () => {
	
	const { id } = useParams(); // URL에서 boardId 가져오기
	const [textBoard, setTextBoard] = useState(null);
	
	useEffect(() => {
		const fetchBoard = async () => {
			try {
				const rsp = await TextBoardApi.detailTextBoard(id);
				console.log(rsp);
				setTextBoard(rsp.data);
			} catch (error) {
				console.error("게시판 내용 불러오는중 에러 발생 : ");
				console.error(error);
			}
		}
		fetchBoard();
	}, [id]);
	
	if (!textBoard) {
		return <div>Loading...</div>;
	}
	
	return (
		<Box sx={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>
			<Paper sx={{ padding: 2 }}>
				<Box sx={{ marginBottom: 3 }}>
					<Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
						{textBoard.title}
					</Typography>
					<Typography variant="body2" sx={{ color: '#777', marginTop: 1 }}>
						{textBoard.nickName} | {textBoard.regDate}
					</Typography>
				</Box>
				<Box sx={{ marginBottom: 3 }}>
					<Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#333' }}>
						{textBoard.content}
					</Typography>
				</Box>
				<Box sx={{ marginTop: 3 }}>
					<Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4a90e2' }}>
						Category: {textBoard.textCategory}
					</Typography>
				</Box>
			</Paper>
		</Box>
	);
};
export  default PostItemMain