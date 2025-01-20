import React, { useState } from "react";
import { Button, Typography, LinearProgress, Box } from "@mui/material";

// 파일 업로드 컴포넌트
const FileUploader = ({
	                      folderPath="upload",     // 업로드할 폴더 경로, 기본값 : firebase/upload/
	                      uploadApi,      // 파일을 업로드할 API 함수
                      }) => {
	// 파일 상태 (선택한 파일을 저장)
	const [file, setFile] = useState(null);
	
	
	// 파일 선택 핸들러: 파일이 선택되면 파일 상태 업데이트
	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];  // 파일 객체 가져오기
		if (selectedFile) {
			setFile(selectedFile);  // 파일 상태 업데이트
		}
	};
	
	// 파일 업로드 핸들러: 파일을 업로드하는 기능을 처리
	const handleUpload = async () => {
		if (!file || !folderPath) return;  // 파일이 없거나 폴더 경로가 없으면 업로드 안 함
		
		try {
			// `uploadApi`는 `props`로 전달된 파일 업로드 API 함수
			// 이 함수는 파일과 폴더 경로, 진행률을 업데이트하는 콜백을 받음
			
			const formData = new FormData();
			formData.append("file", file);  // 파일 추가
			formData.append("folderPath", folderPath);  // 폴더 경로 추가
			
			const rsp = await uploadApi(formData)
			
			// 업로드 성공 여부 확인 후 메시지 설정
			if (rsp.data.success) {
				console.log("파일 URL:", rsp.data.fileUrl);  // 업로드된 파일 URL 출력
			}
		} catch (error) {
			console.error("파일 업로드 중 오류:", error);  // 오류 로그 출력
		}
	};
	
	return (
		<Box sx={{ padding: 3, borderRadius: 2, boxShadow: 2 }}>
			<Typography variant="h6">파일 업로드 ({folderPath})</Typography>
			
			{/* 파일 선택 버튼 */}
			<Button variant="contained" component="label">
				파일 선택
				<input type="file" hidden onChange={handleFileChange} />  {/* 파일 선택 input */}
			</Button>
			
			{/* 선택한 파일 이름 표시 */}
			{file && <Typography variant="body1">{file.name}</Typography>}
			
			{/* 업로드 버튼 */}
			<Button variant="contained" onClick={handleUpload} disabled={!file}>
				업로드
			</Button>
		</Box>
	);
};

// 컴포넌트 기본 export
export default FileUploader;
