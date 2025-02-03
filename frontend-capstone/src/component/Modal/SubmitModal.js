import React, {useEffect, useState} from "react";
import { Dialog, DialogContent, DialogActions, Typography, Button, TextField } from "@mui/material";
import styled from "styled-components";
import RejectModal from "./RejectModal";

const SubmitModal = ({ open, message, initial = "", restriction, onSubmit, onCancel }) => {
	const [content, setContent] = useState("");
	const [reject, setReject] = useState({});
	const [id, setId] = useState(0);
	
	useEffect(() => {
		setContent(initial.content);
		setId(initial.id);
	}, [initial]);
	
	const onChangeContent = (e) => {
		if (restriction) {
			setReject({ value: true, message: restriction });
			return;
		}
		setContent(e.target.value);
	};
	
	const onSubmitHandler = () => {
		if (content.trim() === "") {
			setReject({ value: true, message: "내용을 입력하세요." });
			return;
		}
		
		onSubmit({content: content, id: id}); // 댓글 제출 또는 수정 처리
		
		setContent(""); // 내용 초기화
		onCancel(); // 모달 닫기
	};
	if(!open) return (<></>)
	
	return (
		<Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
			<CustomDialogContent>
				<Typography variant="h6" gutterBottom>
					{message &&
						message.split("\n").map((line, index) => (
							<span key={index}>
                {line}
								<br />
              </span>
						))}
				</Typography>
				<TextField onChange={onChangeContent} value={content} multiline={true} minRows={3} maxRows={8} />
			</CustomDialogContent>
			<DialogActions>
				<StyledButton variant="contained" color="primary" onClick={onSubmitHandler}>
					제출
				</StyledButton>
				<StyledButton variant="outlined" color="error" onClick={onCancel}>
					취소
				</StyledButton>
			</DialogActions>
			<RejectModal open={reject.value} onClose={() => setReject({})} message={reject.message} />
		</Dialog>
	);
};

export default SubmitModal;

// 스타일 추가
const CustomDialogContent = styled(DialogContent)`
    text-align: center;
    padding: 24px;
`;

const StyledButton = styled(Button)`
    width: 100px;
    margin: 8px;
`;
