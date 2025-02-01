import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Box, IconButton, Paper, Tooltip, Typography} from "@mui/material";
import TextBoardApi from "../../../../api/TextBoardApi";
import Commons from "../../../../util/Common";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useSelector} from "react-redux";


const PostItemMain = () => {
	
	const { id } = useParams(); // URL에서 boardId 가져오기
	const [textBoard, setTextBoard] = useState(null);
	const [link, setLink] = useState(null);
	const role = useSelector(state => state.persistent.role);
	
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
	
	useEffect(() => {
		const fetchIsAuthor  = async () => {
			try{
				const rsp = await TextBoardApi.isAuthor(id);
				console.log(rsp);
				setLink(rsp.data);
			} catch (error) {
				console.error(error);
			}
		}
		fetchIsAuthor()
	},[role])
	
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
						{textBoard.nickName} | {Commons.formatDate(textBoard.regDate)}
					</Typography>
				</Box>
				<Box sx={{ marginBottom: 3 }}>
					<Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#333' }}>
						{textBoard.content}
					</Typography>
				</Box>
			</Paper>
			{link && <ButtonContainer>
				<Tooltip title="수정">
					<IconButton>
						<EditIcon/>
					</IconButton>
				</Tooltip>
				<Tooltip title="삭제">
					<IconButton>
						<DeleteIcon/>
					</IconButton>
				</Tooltip>
			</ButtonContainer>}
		</Box>
	);
};

const ButtonContainer = styled.div`
	display: flex;
		justify-content: flex-end;
		gap: 2vw;
`

export  default PostItemMain