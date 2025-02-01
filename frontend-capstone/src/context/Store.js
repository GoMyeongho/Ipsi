import {configureStore} from "@reduxjs/toolkit";
import PersistentReducer from "./redux/PersistentReducer";
import ModalReducer from "./redux/ModalReducer";



const Store = configureStore({
	reducer: {
		persistent: PersistentReducer, // localStorage 연동
		modal: ModalReducer,
	},
	
});

export default Store;