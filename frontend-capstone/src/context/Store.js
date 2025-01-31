import {configureStore} from "@reduxjs/toolkit";
import PersistentReducer from "./redux/PersistentReducer";



const Store = configureStore({
	reducer: {
		persistent: PersistentReducer // localStorage 연동
		// volatile: reducerWithoutLocalStorage, // 메모리에서만 관리
	},
	
});

export default Store;