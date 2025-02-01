import React from "react";
import { Dialog, DialogContent, DialogActions, Typography, Button } from "@mui/material";
import styled from "styled-components";

const ConfirmModal = ({ open, message, onConfirm, onCancel }) => {
	return (
		<Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
			<CustomDialogContent>
				<Typography variant="h6" gutterBottom>
					{message && message.split("\n").map((line, index) => (
						<span key={index}>
							{line}
							<br />
						</span>
					))}
				</Typography>
			</CustomDialogContent>
			<DialogActions>
				<StyledButton variant="contained" color="primary" onClick={onConfirm}>
					확인
				</StyledButton>
				<StyledButton variant="outlined" color="error" onClick={onCancel}>
					취소
				</StyledButton>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmModal;

// 스타일 추가
const CustomDialogContent = styled(DialogContent)`
    text-align: center;
    padding: 24px;
`;

const StyledButton = styled(Button)`
    width: 100px;
    margin: 8px;
`;
