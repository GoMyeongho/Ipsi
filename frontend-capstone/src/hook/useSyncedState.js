import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// 리덕스 상태와 로컬 스토리지를 동기화하는 커스텀 훅
const useSyncedState = (key, actionCreator, defaultValue) => {
	const state = useSelector((state) => state[key]); // 리덕스 상태
	const dispatch = useDispatch();
	
	useEffect(() => {
		const savedValue = localStorage.getItem(key);
		if (savedValue) {
			try {
				const parsedValue = JSON.parse(savedValue);
				if (parsedValue !== state) {
					dispatch(actionCreator(parsedValue)); // 리덕스 액션을 통해 상태 변경
				}
			} catch (error) {
				console.error(`로컬 스토리지에서 "${key}" 값을 불러오는 데 실패했습니다.`, error);
			}
		} else {
			// 로컬 스토리지에 값이 없으면 기본값을 설정
			if (state !== defaultValue) {
				dispatch(actionCreator(defaultValue));
			}
		}
	}, [key, dispatch, state, actionCreator, defaultValue]);
	
	useEffect(() => {
		if (state !== undefined) {
			try {
				localStorage.setItem(key, JSON.stringify(state));
			} catch (error) {
				console.error(`로컬 스토리지에 "${key}" 값을 저장하는 데 실패했습니다.`, error);
			}
		}
	}, [key, state]);
	
	return [state, dispatch]; // 상태와 dispatch를 반환
};

export default useSyncedState;
