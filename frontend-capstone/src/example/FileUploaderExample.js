import React, { useState } from "react";
import { Container, Typography, Box, LinearProgress, Button } from "@mui/material";
import axios from "axios";  // axios 임포트
import FileUploader from "../component/FileUploader";  // FileUploader 컴포넌트 가져오기

const UploadPage = () => {
	// 업로드 진행 상태를 추적할 상태
	const [uploadStatus, setUploadStatus] = useState("");
	
	// 업로드 진행률을 추적할 상태
	const [uploadProgress, setUploadProgress] = useState(0);
	
	// 파일 업로드 상태 콜백: 업로드 진행 상태를 업데이트
	const handleProgress = (progress) => {
		setUploadProgress(progress);
	};
	
	// 업로드 결과 메시지를 설정하는 함수
	const handleUploadResult = (message) => {
		setUploadStatus(message);
	};
	
	// Spring Boot 백엔드로 파일을 업로드하는 API 호출
	const customUploadApi = async (formData) => {
		try {
			const token = localStorage.getItem("accessToken");
			const response = await axios.post("http://localhost:8111/firebase/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
				},
			});
			console.log(response);
			if (response.data.message === "File uploaded successfully") {
				handleUploadResult("파일 업로드 성공!");
				console.log("파일 URL:", response.data.urls);  // 업로드된 파일 URL 출력
			} else {
				handleUploadResult("파일 업로드 실패.");
			}
			
			return response;
		} catch (error) {
			handleUploadResult("파일 업로드 중 오류 발생.");
			console.error("파일 업로드 중 오류:", error);
			throw error;
		}
	};
	
	return (
		<Container sx={{ padding: 3 }}>
			<Box sx={{ marginBottom: 3 }}>
				<Typography variant="h4">파일 업로드 페이지</Typography>
				<Typography variant="body1" sx={{ marginTop: 1 }}>
					파일을 선택하고 업로드 버튼을 클릭하여 서버에 업로드할 수 있습니다.
				</Typography>
			</Box>
			
			{/* FileUploader 컴포넌트 사용 */}
			<FileUploader
				folderPath="test/test"  // 업로드할 폴더 경로
				uploadApi={customUploadApi}    // 파일 업로드 API 함수
				onProgress={handleProgress}    // 업로드 진행 상태를 추적하는 함수
			/>
			
		</Container>
	);
};

export default UploadPage;
