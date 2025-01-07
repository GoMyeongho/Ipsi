import { storage } from "../api/firebase";  // firebase 설정 import

export const uploadFileToFirebase = (file, path) => {
	return new Promise((resolve, reject) => {
		if (!file) {
			reject("파일을 먼저 선택하세요");
			return;
		}
		if (!path) {
			reject("파일을 업로드할 경로를 입력하세요");
			return;
		}
		
		const storageRef = storage.ref();  // Firebase 스토리지 참조
		const fileRef = storageRef.child(path + "/" + file.name);  // 경로 + 파일명
		fileRef.put(file)  // 파일 업로드
			.then(() => {
				console.log("파일 업로드 성공");
				return fileRef.getDownloadURL();  // 업로드된 파일의 URL을 가져옴
			})
			.then((downloadUrl) => {
				console.log("저장된 경로 : " + downloadUrl);
				resolve(downloadUrl);  // URL 반환
			})
			.catch((error) => {
				reject("업로드 중 에러 발생: " + error);
			});
	});
};
