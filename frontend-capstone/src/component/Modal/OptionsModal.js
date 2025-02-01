import React from "react";
import { Dialog, DialogContent, DialogActions, Typography, Button } from "@mui/material";

const OptionsModal = ({ open, message, options, onOption, onCancel }) => {
	return (
		<Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
			<DialogContent sx={styles.dialogContent}>
				<Typography variant="h6" sx={styles.messageText}>
					{message &&
						message.split("\n").map((line, index) => (
							<span key={index}>
								{line}
								<br />
							</span>
						))}
				</Typography>
			</DialogContent>
			<DialogActions sx={styles.dialogActions}>
				{options &&
					options.map((option, index) => (
						<Button
							key={index}
							variant={option.type === "outlined" ? "outlined" : "contained"}
							color={option.type === "outlined" ? "error" : "primary"}
							onClick={() => onOption(option.value)}
							sx={styles.button}
						>
							{option.label}
						</Button>
					))}
				<Button variant="outlined" color="error" onClick={onCancel} sx={styles.button}>
					취소
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default OptionsModal;

// 스타일 객체
const styles = {
	dialogContent: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "16px 24px",
	},
	messageText: {
		textAlign: "center",
		width: "100%",
		marginBottom: "16px", // 메시지와 버튼 사이 간격
	},
	dialogActions: {
		display: "flex",
		flexDirection: "column", // ✅ 버튼을 세로 정렬
		alignItems: "center", // ✅ 중앙 정렬
		justifyContent: "center", // ✅ 버튼을 중앙 정렬
		gap: "8px", // ✅ 버튼 간격 동일하게 설정
		width: "100%", // ✅ 버튼이 중앙에 오도록 설정
		padding: "16px 0",
	},
	button: {
		width: "80%",
		maxWidth: "200px", // ✅ 버튼 크기 통일
		marginLeft: "8px",
		textAlign: "center",
	},
};
