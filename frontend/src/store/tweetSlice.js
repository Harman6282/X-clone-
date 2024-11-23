import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tweets: [], // Array to store all tweets
  loading: false, // Loading state for fetching tweets
};

const tweetSlice = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    setTweets(state, action) {
      state.tweets = action.payload; // Populate tweets array
      state.loading = false;
    },

    setLoading(state, action) {
      state.loading = action.payload; // Update loading state
    },
    
  },
});

export const { setTweets, setLoading } = tweetSlice.actions;

export default tweetSlice.reducer;
