import { createSlice } from "@reduxjs/toolkit"

export const globalLoadingSlice = createSlice({
    name: "GlobalModal",
    initialState: {
        globalLoading: ""
    },
    reducers: {
        setGlobalLoading: (state, action) => {
            state.globalLoading = action.payload;
        }
    }
})


export const {
    setGlobalLoading
} = globalLoadingSlice.actions;

export default globalLoadingSlice.reducer;