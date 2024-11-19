// store.js
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import tweetReducer from './tweetSlice';

const store = configureStore({
  reducer: {
    profile: profileReducer,
    tweets: tweetReducer
  },
});

export default store;
