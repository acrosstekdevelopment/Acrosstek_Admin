import { createSlice } from "@reduxjs/toolkit";
import ls from "localstorage-slim";

const initialState = {
	tagLoading: false,
	allTags: [],
};

const tagSlice = createSlice({
	name: "tagSlice",
	initialState,
	reducers: {
		setAllTags: (state, { payload }) => {
			state.allTags = payload;
			ls.set("allTagsAdmin", payload);
		},
		setTagLoading: (state, { payload }) => {
			state.tagLoading = payload;
		},

		fetchTagsFromLocal: (state) => {
			state.allTags = ls.get("allTagsAdmin");
		},
	},
});

export const { setAllTags, fetchTagsFromLocal, setTagLoading } = tagSlice.actions;

export default tagSlice.reducer;
