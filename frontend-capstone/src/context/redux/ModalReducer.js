import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isModalOpen: false,
	isMaterialModalOpen: false,
	isLoginModalOpen: false,
	isSignupModalOpen: false,
};

const ModalReducer = createSlice({
	name: "modal",
	initialState,
	reducers: {
		setModalOpen: (state, action) => {
			state.isModalOpen = action.payload;
		},
		setIsMaterialModalOpen: (state, action) => {
			state.isMaterialModalOpen = action.payload;
		},
		setLoginModalOpen: (state, action) => {
			state.isLoginModalOpen = action.payload;
		},
		setSignupModalOpen: (state, action) => {
			state.isSignupModalOpen = action.payload;
		},
		closeAllModals: (state) => {
			state.isModalOpen = false;
			state.isMaterialModalOpen = false;
			state.isLoginModalOpen = false;
			state.isSignupModalOpen = false;
		},
	},
});

export const {
	setModalOpen,
	setIsMaterialModalOpen,
	setLoginModalOpen,
	setSignupModalOpen,
	closeAllModals,
} = ModalReducer.actions;

export default ModalReducer.reducer;
