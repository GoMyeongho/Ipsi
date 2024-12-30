import {useEffect, useState} from "react";

export const useSyncedState = (key, defaultValue) => {
	const [state, setState] = useState(() => {
		const savedValue = localStorage.getItem(key);
		try {
			return savedValue ? JSON.parse(savedValue) : defaultValue;
		} catch (error) {
			console.error(`Failed to parse localStorage value for key "${key}":`, error);
			return defaultValue;
		}
	});
	
	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(state));
		} catch (error) {
			console.error(`Failed to set localStorage value for key "${key}":`, error);
		}
	}, [state]); // 'key'는 초기화 단계에서만 쓰이므로 종속성에서 제외 가능
	
	return [state, setState];
};
