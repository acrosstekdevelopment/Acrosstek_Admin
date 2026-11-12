import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	refreshTag: 0,
};

const tempSlice = createSlice({
	name: "tempSlice",
	initialState,
	reducers: {
		setRefreshTag: (state) => {
			state.refreshTag = Math.random();
		},
	},
});

export const { setRefreshTag } = tempSlice.actions;

export default tempSlice.reducer;
