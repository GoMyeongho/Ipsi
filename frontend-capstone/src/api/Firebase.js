// api/firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/storage";  // Firebase Storage를 사용하기 위한 import

// Firebase 초기화
const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);  // Firebase 초기화
} else {
	firebase.app();  // 이미 초기화된 앱이 있으면 사용
}

// 파일 업로드 함수
export const uploadFileToFirebase = (file, filePath) => {
	const storageRef = firebase.storage().ref();  // Firebase 스토리지 참조
	const fileRef = storageRef.child(filePath);  // 업로드할 파일 경로 설정
	
	return fileRef.put(file)  // 파일 업로드
		.then(() => {
			return fileRef.getDownloadURL();  // 업로드가 끝나면 다운로드 URL 반환
		})
		.catch((error) => {
			throw new Error(error.message);  // 에러 처리
		});
};
