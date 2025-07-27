import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserGroups } from '@/shared/api/groupchat.api';
import { Group } from '@/types/groupType';

export interface GroupState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  loading: false,
  error: null,
};

export const getUserGroups = createAsyncThunk('group/getUserGroups', async () => {
  return await fetchUserGroups();
});

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(getUserGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch groups';
      });
  },
});

export default groupSlice.reducer;
