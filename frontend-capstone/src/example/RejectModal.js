import React, { useState } from "react";
import { uploadFileToFirebase } from "../function/firebaseUpload";  // 업로드 함수 임포트
import RejectModal from "./RejectModal";  // 모달 컴포넌트

const YourComponent = () => {
	const [modalMessage, setModalMessage] = useState("");  // 모달 메시지 상태
	
	// 파일 선택 핸들러
	const handleFileChange = (event) => {
		const file = event.target.files[0];  // 파일 선택
		const path = "your/firebase/storage/path";  // 업로드할 경로 설정
		
		// 파일 업로드 함수 호출
		uploadFileToFirebase(file, path, setModalMessage)
			.then((downloadUrl) => {
				console.log("파일 업로드 성공:", downloadUrl);
			})
			.catch((error) => {
				console.error("업로드 실패:", error);
			});
	};
	
	return (
		<div>
			<input type="file" onChange={handleFileChange} />
			
			{/* 모달 컴포넌트 호출 */}
			<RejectModal open={modalMessage !== ""} message={modalMessage} />
		</div>
	);
};

export default YourComponent;
