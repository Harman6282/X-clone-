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
    // toggleLike(state, action) {
    //   const { tweetId, isLiked, likeCount } = action.payload;
    //   const tweet = state.tweets.find((t) => t.id === tweetId); // Find the specific tweet
    //   if (tweet) {
    //     tweet.isLiked = isLiked; // Update the like status
    //     tweet.likeCount = likeCount; // Update the like count
    //   }
    // },
  },
});

export const { setTweets, setLoading, toggleLike } =
  tweetSlice.actions;

export default tweetSlice.reducer;
