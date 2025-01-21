import React, { useState } from "react";
import { Button, Typography, LinearProgress, Box } from "@mui/material";

// 파일 업로드 컴포넌트
const FileUploader = ({
	                      folderPath,     // 업로드할 폴더 경로
	                      uploadApi,      // 파일을 업로드할 API 함수 (예: firebaseUploader)
	                      onProgress,     // 업로드 진행 상태를 상위 컴포넌트로 전달할 콜백 함수
                      }) => {
	// 파일 상태 (선택한 파일을 저장)
	const [file, setFile] = useState(null);
	
	// 업로드 진행률 상태 (0 ~ 100)
	const [uploadProgress, setUploadProgress] = useState(0);
	
	// 업로드 상태 메시지 (성공, 실패 또는 오류 메시지)
	const [uploadStatus, setUploadStatus] = useState("");
	
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
			const result = await uploadApi(file, folderPath, (progress) => {
				setUploadProgress(progress);  // 업로드 진행률 업데이트
				if (onProgress) onProgress(progress);  // 상위 컴포넌트로 진행률 전달
			});
			
			// 업로드 성공 여부 확인 후 메시지 설정
			if (result.success) {
				setUploadStatus("파일 업로드 성공!");  // 성공 메시지
				console.log("파일 URL:", result.fileUrl);  // 업로드된 파일 URL 출력
			} else {
				setUploadStatus("파일 업로드 실패.");  // 실패 메시지
			}
		} catch (error) {
			setUploadStatus("파일 업로드 중 오류 발생.");  // 오류 발생 시 메시지
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
			
			{/* 업로드 진행률 표시 (0~100%) */}
			{uploadProgress > 0 && (
				<LinearProgress variant="determinate" value={uploadProgress} />
			)}
			
			{/* 업로드 상태 메시지 표시 (성공, 실패, 오류 등) */}
			{uploadStatus && <Typography>{uploadStatus}</Typography>}
		</Box>
	);
};

// 컴포넌트 기본 export
export default FileUploader;
