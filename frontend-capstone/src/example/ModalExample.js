import React, { useState } from "react";
import RejectModal from "../component/Modal/RejectModal";
import ConfirmModal from "../component/Modal/ConfirmModal";
import { Button } from "@mui/material";

const ModalExample = () => {
	const [isRejectOpen, setIsRejectOpen] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	
	return (
		<div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
			{/* 거절 모달 */}
			<Button variant="contained" color="error" onClick={() => setIsRejectOpen(true)}>
				거절 모달 열기
			</Button>
			<RejectModal open={isRejectOpen} message="이 요청을 거절하시겠습니까?" onClose={() => setIsRejectOpen(false)} />
			
			{/* 확인 모달 */}
			<Button variant="contained" color="primary" onClick={() => setIsConfirmOpen(true)}>
				확인 모달 열기
			</Button>
			<ConfirmModal
				open={isConfirmOpen}
				message="이 작업을 확인하시겠습니까?"
				onConfirm={() => {setIsConfirmOpen(false);}}
				onCancel={() => setIsConfirmOpen(false)}
			/>
		</div>
	);
};

export default ModalExample;
