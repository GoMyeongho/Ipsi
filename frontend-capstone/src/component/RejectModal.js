import React from "react";
import { Dialog, DialogContent, DialogActions, Typography, Button } from "@mui/material";
import styled from "styled-components";

const RejectModal = ({ open, message, onClose }) => {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<CustomDialogContent>
				<Typography variant="h6" gutterBottom>
					{message}
				</Typography>
			</CustomDialogContent>
			<DialogActions>
				<StyledButton variant="contained" color="error" onClick={onClose}>
					닫기
				</StyledButton>
			</DialogActions>
		</Dialog>
	);
};

export default RejectModal;

// 스타일 추가
const CustomDialogContent = styled(DialogContent)`
    text-align: center;
    padding: 24px;
`;

const StyledButton = styled(Button)`
    width: 100px;
    margin: 8px;
`;
