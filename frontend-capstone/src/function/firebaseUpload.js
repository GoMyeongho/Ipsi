import { storage } from "../api/Firebase";  // firebase 설정 import

// Firebase에 파일을 업로드하고 다운로드 URL을 반환하는 함수
export const uploadFileToFirebase = (file, path, setModalMessage) => {
	return new Promise((resolve, reject) => {
		// 파일이 없는 경우 처리
		if (!file) {
			setModalMessage("파일을 먼저 선택하세요");  // 모달로 에러 메시지 전달
			return;
		}
		// 업로드할 경로가 없는 경우 처리
		if (!path) {
			setModalMessage("파일을 업로드할 경로를 입력하세요");  // 모달로 에러 메시지 전달
			return;
		}
		
		// Firebase 스토리지 참조
		const storageRef = storage.ref();
		// 경로와 파일명 결합
		const fileRef = storageRef.child(path + "/" + file.name);
		
		// 파일 업로드 시작
		fileRef.put(file)
			.then(() => {
				console.log("파일 업로드 성공");
				// 업로드된 파일의 다운로드 URL을 가져옴
				return fileRef.getDownloadURL();
			})
			.then((downloadUrl) => {
				console.log("저장된 경로 : " + downloadUrl);
				resolve(downloadUrl);  // 다운로드 URL 반환
			})
			.catch((error) => {
				// 에러 발생 시
				setModalMessage("업로드 중 에러 발생: " + error);  // 모달로 에러 메시지 전달
			});
	});
};
