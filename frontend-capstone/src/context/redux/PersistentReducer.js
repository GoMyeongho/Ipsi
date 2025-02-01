import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	accessToken: localStorage.getItem("accessToken") || "",
	refreshToken: localStorage.getItem("refreshToken") || "",
	role: localStorage.getItem("role") || "",
};

const PersistentReducer = createSlice({
	name: "persistent",
	initialState,
	reducers: {
		setAccessToken: (state, action) => {
			state.accessToken = action.payload;
			localStorage.setItem("accessToken", action.payload);
		},
		setRefreshToken: (state, action) => {
			state.refreshToken = action.payload;
			localStorage.setItem("refreshToken", action.payload);
		},
		setRole: (state, action) => {
			state.role = action.payload;
			localStorage.setItem("role", action.payload);
		},
		logout: (state) => {
			state.accessToken = "";
			state.refreshToken = "";
			state.role = "";
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("role");
		},
	},
});

export const { setAccessToken, setRefreshToken, setRole, logout } = PersistentReducer.actions;
export default PersistentReducer.reducer;
