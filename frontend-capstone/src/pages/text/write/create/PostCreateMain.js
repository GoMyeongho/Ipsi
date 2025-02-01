import { BackGround } from "../../../../styles/GlobalStyle";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import styled from "styled-components";
import RejectModal from "../../../../component/Modal/RejectModal";
import CreateIcon from "@mui/icons-material/Create";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TextBoardApi from "../../../../api/TextBoardApi";
import ConfirmModal from "../../../../component/Modal/ConfirmModal";
import {categoryTitle} from "../../post/list/PostListHeader";

const PostCreateMain = () => {
	const { id, category } = useParams();
	const role = useSelector((state) => state.persistent.role);
	const navigator = useNavigate();
	const [reject, setReject] = useState({});
	const [confirm, setConfirm] = useState({});
	const [response, setResponse] = useState({ title: "", content: "" });
	
	useEffect(() => {
		const fetchPost = async () => {
			if (role === null || role === "REST_USER" || role === "") {
				setReject({ value: true, label: "로그인 하지 않으면 사용할 수 없습니다." });
			}
			if (category === "faq" && role !== "ROLE_ADMIN") {
				setReject({ value: true, label: "관리자가 아니면 사용할 수 없습니다." });
			}
			if (id) {
				const rsp = await TextBoardApi.detailTextBoardForEdit(id);
				if (rsp.data !== null && rsp.data !== undefined) {
					if (category !== rsp.data.category) navigator(`/post/create/${category}/${id}`);
					setResponse(rsp.data);
				} else {
					setReject({ value: true, label: "해당 글의 작성자가 아닙니다." });
				}
			}
		};
		fetchPost();
	}, [id, role]);
	
	const onChangeTitle = (e) => {
		setResponse({ ...response, title: e.target.value });
	};
	const onChangeContent = (e) => {
		setResponse({ ...response, content: e.target.value });
	};
	const onClickSubmit = async () => {
		const { title, content, email } = response;
		if (id) {
			const rsp = await TextBoardApi.updateTextBoard(title, content, category, email, id);
			console.log(rsp);
			setConfirm({
				value: true,
				label: rsp.data ? "글 수정에 성공 했습니다.\n계속 작성 하시겠습니까?" : "글 작성에 실패 했습니다.\n계속 작성 하시겠습니까?",
			});
		} else {
			const rsp = await TextBoardApi.createTextBoard(title, content, category, email);
			setConfirm({
				value: true,
				label: rsp.data ? "글 작성에 성공 했습니다.\n계속 작성 하시겠습니까?" : "글 작성에 실패 했습니다.\n계속 작성 하시겠습니까?",
				onConfirm: (rsp.data) ? () => {
					navigator(`/post/create/${category}/${rsp.data}`);
					setConfirm({})
				} : null,
			});
		}
	};
	const onClickCancel = () => {
		setConfirm({ value: true, label: "취소버튼이 눌렸습니다. 작성을 계속 하시겠습니까?" });
	};
	
	return (
		<BackGround>
			<Title>{id ? `${categoryTitle.find(title => title.value === category)?.label || "기본 제목"} 글 수정`
				: `새로운 ${categoryTitle.find(title => title.value === category)?.label || "기본 제목"} 글 작성`}</Title>
			<TitleContainer>
				<TextField
					sx={styles.title}
					label="제목을 입력하세요"
					value={response.title}
					onChange={onChangeTitle}
					variant="outlined"
				/>
			</TitleContainer>
			<ContentsContainer>
				<TextField
					sx={styles.content}
					placeholder="내용을 입력하세요"
					value={response.content}
					onChange={onChangeContent}
					multiline
					minRows={10} // 최소 10줄 높이
					maxRows={20} // 최대 20줄로 확장 가능
					variant="outlined"
				/>
			</ContentsContainer>
			<ButtonContainer>
				<Tooltip title="저장하기">
					<IconButton onClick={onClickSubmit} sx={{ color: "green" }}>
						<CreateIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title="취소하기">
					<IconButton onClick={onClickCancel} sx={{ color: "red" }}>
						<CloseIcon />
					</IconButton>
				</Tooltip>
			</ButtonContainer>
			<RejectModal open={reject.value} message={reject.label} onClose={() => navigator(`/post/list/${category}`)} />
			<ConfirmModal
				open={confirm.value}
				message={confirm.label}
				onConfirm={confirm.onConfirm ? confirm.onConfirm : () => setConfirm({})}
				onCancel={() => navigator(`/post/list/${category}`)}
			/>
		</BackGround>
	);
};

const TitleContainer = styled(Box)`
		margin-top: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const ContentsContainer = styled(Box)`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const ButtonContainer = styled(Box)`
    display: flex;
    justify-content: flex-end;
    gap: 2vw;
`;

const styles = {
	title: {
		display: "flex",
		width: "90%",
		fontSize: "1.2em",
		fontWeight: "bold",
		border: "none",
		padding: "1vw 0",
		outline: "none",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
		"&:focus": {
			borderBottom: "1px solid #6154D4",
		},
	},
	content: {
		display: "flex",
		width: "90%",
		padding: "15px",
		outlineStyle: "none",
		border: "1px solid #AAA",
		borderRadius: "5px",
		fontSize: "1em",
		minHeight: "200px", // 최소 높이 설정
		overflowY: "auto",
		"&::-webkit-scrollbar": {
			width: "10px",
		},
		"&::-webkit-scrollbar-thumb": {
			background: "#9f8fe4",
			borderRadius: "10px",
		},
		"&::-webkit-scrollbar-track": {
			background: "#FFF",
			borderRadius: "10px",
		},
	},
};
const Title = styled.div`
		width: 100%;
    font-size: 24px;
    font-weight: bold;
		margin-left: 100px;
		margin-top: 50px;
		display: flex;
`;
export default PostCreateMain;
