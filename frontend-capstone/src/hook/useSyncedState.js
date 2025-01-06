import {useEffect, useState} from "react";

export const useSyncedState = (key, defaultValue) => {
	const [state, setState] = useState(() => {
		const savedValue = localStorage.getItem(key);
		try {
			return savedValue ? JSON.parse(savedValue) : defaultValue;
		} catch (error) {
			console.error(`로컬 스토리지에서 키값을 받아오는데 실패 했습니다. "${key}":`, error);
			return defaultValue;
		}
	});
	
	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(state));
		} catch (error) {
			console.error(`로컬스토리지에 키에 값을 넣는데 실패했습니다. "${key}":`, error);
		}
	}, [state]); // 'key'는 초기화 단계에서만 쓰이므로 종속성에서 제외 가능
	
	return [state, setState];
};
