import { useState } from "react";

const useImageCompressor = () => {
	const [compressedLinks, setCompressedLinks] = useState([]);
	
	// 이미지 압축 함수
	const compressImage = (url, quality = 0.8) => {
		return new Promise((resolve, reject) => {
			const img = new window.Image();
			img.src = url;
			img.crossOrigin = "anonymous";
			
			img.onload = () => {
				try {
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");
					
					canvas.width = img.width / 1.25;
					canvas.height = img.height / 1.25;
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					
					const imageType = img.src.includes("png") ? "image/png" : "image/jpeg";
					resolve(canvas.toDataURL(imageType, quality)); // 압축된 이미지 반환
				} catch (error) {
					console.error("이미지 압축 중 오류:", error);
					reject(new Error("이미지 압축 중 문제가 발생했습니다."));
				}
			};
			
			img.onerror = (err) => {
				console.error("이미지 로드 중 오류:", err);
				reject(new Error("이미지 로딩에 실패했습니다."));
			};
		});
	};
	
	// 링크 압축 및 상태 업데이트
	const compressImages = async (links) => {
		try {
			const compressed = await Promise.all(
				links.map((url) => compressImage(url))
			);
			setCompressedLinks(compressed);
		} catch (error) {
			console.error("이미지 압축 실패:", error);
		}
	};
	
	return { compressedLinks, compressImages };
};

export default useImageCompressor;
