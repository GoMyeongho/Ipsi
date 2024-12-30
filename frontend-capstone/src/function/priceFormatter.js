
export const priceFormatter = (price) => {
	if (price === undefined || price === null) {
		console.warn("priceFormatter에 undefined 또는 null 값 전달");
		return "0"; // 기본값 반환
	}
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const dateFormatter = (localDateTimeString) => {
	if (!localDateTimeString) {
		console.warn("dateFormatter에 undefined 또는 null 값 전달");
		return null; // 기본값 반환
	}
	
	try {
		// LocalDateTime 문자열 형식 예: "2023-12-18T14:30:45"
		const [date, time] = localDateTimeString.split("T");
		// 데이터 타입이 올바른지 확인
		if (!date || !time) {
			console.warn("dateFormatter 에 올바르지 않은 데이터 형식 : ", localDateTimeString);
			return null;
		}
		const [year, month, day] = date.split("-").map(Number);
		const [hour, minute, second] = time.split(":").map(Number);
		
		// 객체로 반환
		return {year, month, day, hour, minute, second,};
	} catch (error) {
		console.error("dateFormatter 처리 중 오류 발생:", error);
		return null;
	}
};