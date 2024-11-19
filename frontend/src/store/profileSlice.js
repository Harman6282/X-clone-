// profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  loading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setProfile, setLoading  } = profileSlice.actions;

export default profileSlice.reducer;
