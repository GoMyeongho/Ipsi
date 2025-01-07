import React, { useState } from "react";
import RejectModal from "../component/RejectModal";  // 모달 컴포넌트

const RejectModalExample = () => {
	const [modalMessage, setModalMessage] = useState("");  // 모달 메시지 상태
	const [open, setOpen] = useState(false);  // 모달 열기/닫기 상태
	
	console.log(open)
	// 모달 닫기 함수
	const handleCloseModal = () => {
		setOpen(false);  // 모달 닫기
		setModalMessage("");  // 모달 메시지 초기화
	};
	
	// 모달 메시지 설정 함수 (임시로 확인용)
	const handleShowModal = () => {
		setModalMessage("모달 메시지 예시입니다.");  // 메시지 설정
		setOpen(true);  // 모달 열기
	};
	
	return (
		<div>
			<br/>
			<button onClick={handleShowModal}>모달 열기</button>  {/* 버튼 클릭 시 모달 열기 */}
			
			{/* 모달 컴포넌트 호출 */}
			{open && <RejectModal open={open} message={modalMessage} onClose={handleCloseModal} />}
		</div>
	);
};

export default RejectModalExample;
