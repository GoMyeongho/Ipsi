import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Box, IconButton, Paper, Tooltip, Typography} from "@mui/material";
import TextBoardApi from "../../../../api/TextBoardApi";
import Commons from "../../../../util/Common";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useSelector} from "react-redux";
import Comments from "./Comments";
import CursorModal from "../../../../component/Modal/CursorModal";
import RejectModal from "../../../../component/Modal/RejectModal";
import {categoryTitle} from "../list/PostListHeader";


const PostItemMain = () => {
	
	const { id } = useParams(); // URL에서 boardId 가져오기
	const [textBoard, setTextBoard] = useState(null);
	const [link, setLink] = useState(null);
	const role = useSelector(state => state.persistent.role);
	const [info, setInfo] = useState({});
	const [reject, setReject] = useState({});
	const navigate = useNavigate();
	
	useEffect(() => {
		const fetchBoard = async () => {
			try {
				const rsp = await TextBoardApi.detailTextBoard(id);
				console.log(rsp);
				if(rsp.data.active === "INACTIVE" && role !== "ROLE_ADMIN") {
					setReject({value: true, label: "해당 게시글은 삭제되었습니다.", onClose: () => navigate(`/post/list/${rsp.data.textCategory}`) });
				}
				setTextBoard(rsp.data);
			} catch (error) {
				console.error("게시판 내용 불러오는중 에러 발생 : ");
				console.error(error);
			}
		}
		fetchBoard();
	}, [id, role]);
	
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
	
	const onClickDelete = async () => {
		try{
			const rsp = await TextBoardApi.deleteTextBoard(id);
			console.log(rsp);
			if(rsp.data) {
				setReject({value: true, label: "게시글 삭제에 성공했습니다.", onClose: () => navigate(`/post/list/${textBoard.textCategory}`)})
				return
			}
			setReject({value: true, label: "게시글 삭제에 실패했습니다.", onClose: () => setReject({})})
		} catch (error) {
			console.error(error);
			setReject({value: true, label: "서버와 통신 중 오류가 생겼습니다.", onClose: () => setReject({})})
		}
	}
	
	const onClickName = (event) => {
		// 역할이 "REST_USER" 또는 빈 문자열인 경우 반환
		if (role === "REST_USER" || role === "") return;
		
		// 클릭한 위치를 받아오기
		const { clientX, clientY } = event;
		
		// setInfo 호출 시 클릭한 위치 정보도 포함시키기
		setInfo({
			value: true,
			options: options,
			position: { x: clientX, y: clientY },  // 클릭한 위치 정보 추가
		});
	};
	const options = [
		{label: "작성 글", value: "text"},
		{label: "작성 이용후기", value: "review"},
		// {label: "1대1 채팅하기", value: "chat"}
		{label: "올린 자소서 보기", value: "ps"},
		{label: "올린 생기부 보기", value: "sr"}
	]
	
	const onOption = (value) => {
		switch (value) {
			case "text":
				navigate("#");
				break;
			case "review":
				navigate("#");
				break;
			case "ps":
				navigate("#");
				break;
			case "sr":
				navigate("#");
				break;
			case "chat":
				navigate("#");
				break;
			default:
				setInfo({})
				break;
		}
	}
	
	if (!textBoard) {
		return <div>Loading...</div>;
	}
	return (
		<Box sx={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>
			<Title>{categoryTitle.find(title => title.value === (textBoard.textCategory).toLowerCase())?.label || "기본 제목"}</Title>
			<Box sx={{ padding: 2 ,borderBottom: "1px solid gray" }}>
				<Box sx={{ marginBottom: 3 }}>
					<Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
						{textBoard.title}
					</Typography>
					{textBoard.textCategory !== "FAQ"  &&
						<Box sx={{ marginBottom: 3 }}>
							<Typography variant="body2" sx={{ color: '#777', marginTop: 1 }}>
								<span onClick={onClickName} style={{ cursor: 'pointer' }}>
									{textBoard.nickName}
								</span>
								{` | ${Commons.formatDate(textBoard.regDate)}`}
							</Typography>
						</Box>}
				</Box>
				<Box sx={{ marginBottom: 3 }}>
					<Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#333' }}>
						{textBoard.content}
					</Typography>
				</Box>
			</Box>
			<ButtonContainer>
			{link &&
				<Tooltip title="글 수정">
					<IconButton onClick={() => navigate(`${link}`)}>
						<EditIcon/>
					</IconButton>
				</Tooltip>
			}
			{ (link || role === "ROLE_ADMIN") &&
				<Tooltip title="글 삭제">
					<IconButton onClick={onClickDelete}>
						<DeleteIcon/>
					</IconButton>
				</Tooltip>
			}
			</ButtonContainer>
			{textBoard.textCategory !== "FAQ"  &&
				<Comments/>}
			<RejectModal open={reject.value} message={reject.label} onClose={reject.onClose} />
			<CursorModal open={info.value} message={null} position={info.position} onCancel={() => setInfo({})} onOption={(e) => onOption(e)} options={info.options} />
		</Box>
	);
};

const ButtonContainer = styled.div`
	display: flex;
		justify-content: flex-end;
		gap: 2vw;
		margin-top: 20px;
`
const Title = styled.div`
    font-size: 24px;
    font-weight: bold;
		margin-bottom: 20px;
`;

export  default PostItemMain