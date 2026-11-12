import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import tagSlice from "./slice/tagSlice";
import tempSlice from "./slice/tempSlice";

const store = configureStore({
	reducer: {
		auth: authSlice,
		temp: tempSlice,
		tag: tagSlice,
	},
});

export default store;
