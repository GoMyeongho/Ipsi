import { useState } from "react";
import RejectModal from "../component/RejectModal";  // 모달 컴포넌트 import

const FileUpload = () => {
	const [file, setFile] = useState(null);
	const [path, setPath] = useState("");
	const [url, setUrl] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	
	// 파일 선택 핸들러
	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};
	
	// 경로는 개발자가 직접 설정 (예: 'uploads/filename')
	const filePath = `uploads/${file.name}`;  // 파일 경로 설정 (이 부분을 개발자가 설정)
	
	// 업로드 버튼 클릭 핸들러
	const handleUploadClick = () => {
		if (!file) {
			setErrorMessage("파일을 먼저 선택하세요");
			return;
		}
		if (!path) {
			setErrorMessage("파일 경로를 입력하세요");
			return;
		}
		
		// 예시로 Firebase 업로드 함수 실행 (여기서는 가상의 함수)
		uploadFileToFirebase(file, path)
			.then((downloadUrl) => {
				setUrl(downloadUrl);
			})
			.catch((error) => {
				setErrorMessage(error.message);
			});
	};
	
	// 모달 닫기 함수
	const closeModal = () => {
		setErrorMessage("");  // 에러 메시지를 초기화하여 모달을 닫습니다.
	};
	
	return (
		<div>
			<input type="file" onChange={handleFileChange} />
			<input type="text" value={path} onChange={handlePathChange} placeholder="파일 경로" />
			<button onClick={handleUploadClick}>업로드</button>
			
			{url && <p>업로드된 파일: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>}
			
			{/* errorMessage가 있을 경우에만 모달을 표시 */}
			{errorMessage && <RejectModal message={errorMessage} onClose={closeModal} />}
		</div>
	);
};

export default FileUpload;
