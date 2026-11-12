import { createSlice } from "@reduxjs/toolkit";
import ls from "localstorage-slim";

const initialState = {
	user: null,
	token: "",
	language: "English",
};

const authSlice = createSlice({
	name: "authSlice",
	initialState,
	reducers: {
		fetchFromStorage: (state) => {
			const user = sessionStorage.getItem("krosshire_user");
			const token = sessionStorage.getItem("krosshire_token");

			if (user) state.user = JSON.parse(user);
			if (token) state.token = JSON.parse(token);
		},

		setUser: (state, { payload }) => {
			state.user = payload.user;
			state.token = payload.token;

			sessionStorage.setItem("krosshire_user", JSON.stringify(payload.user));
			sessionStorage.setItem("krosshire_token", JSON.stringify(payload.token));
		},

		removeUser: (state) => {
			sessionStorage.removeItem("krosshire_user");
			sessionStorage.removeItem("krosshire_token");
			state.user = null;
			state.token = "";
			ls.remove("allTagsAdmin");
		},

		setLanguage: (state, { payload }) => {
			state.language = payload;
			ls.set("language", payload);
		},
		fetchLanguageFromLocal: (state) => {
			const storedLanguage = ls.get("language");
			state.language = storedLanguage || "English";
			if (!storedLanguage) {
				ls.set("language", "English");
			}
		},
	},
});

export const { fetchFromStorage, setUser, removeUser, setLanguage, fetchLanguageFromLocal } = authSlice.actions;

export default authSlice.reducer;
