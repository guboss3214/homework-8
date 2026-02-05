import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUserData } from "../../interfaces/userData";
import { getMyProfileInfoRequest, loginRequest, registerRequest } from "../../api/userActions";
import { allPostsRequest, createPostRequest, deletePostRequest, myPostsRequest } from "../../api/exhibitActions";
import { addCommentRequest, deleteCommentRequest, getCommentRequest } from "../../api/commentActions";

type Profile = {
  id: number;
  username: string;
}

interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  profile: Profile | null;
  postsUpdatedTrigger: number;
}

interface AddCommentArgs {
  id: number;
  text: string;
}

const initialState: UserState = {
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    profile: null,
    postsUpdatedTrigger: 0,
};

export const loginUser = createAsyncThunk('/api/auth/login', async (data: IUserData) => {
    const res = await loginRequest(data);
    return res.data;
})

export const registerUser = createAsyncThunk('/users/register', async (data: IUserData) => {
    const res = await registerRequest(data);
    return res.data;
})

export const myPosts = createAsyncThunk('/api/exhibits/my-posts', async () => {
    const res = await myPostsRequest();
    return res.data;
})

export const createPost = createAsyncThunk('/api/exhibits', async (postData: FormData) => {
    const res = await createPostRequest(postData);
    return res.data;
})

export const getAllPosts = createAsyncThunk('/api/exhibits', async () => {
    const res = await allPostsRequest();
    return res.data;
})

export const addComment = createAsyncThunk('/api/posts/addComment', async ({ id, text }: AddCommentArgs) => {
    const res = await addCommentRequest(id, text);
    return res.data;
})

export const getComment = createAsyncThunk('/api/posts/getComments', async (id: number) => {
    const res = await getCommentRequest(id);
    return res.data;
})

export const deleteComment = createAsyncThunk('/api/exhibits/deleteComment', async ({ exhibitId, commentId }: { exhibitId: number, commentId: number }) => {
    const res = await deleteCommentRequest(exhibitId, commentId);
    return res.data;
})

export const deletePost = createAsyncThunk('/api/exhibits/delete', async (id: number) => {
    const res = await deletePostRequest(id);
    return res.data;
})

export const getMyProfileInfo = createAsyncThunk('/api/users/my-profile', async () => {
    const res = await getMyProfileInfoRequest();
    return res.data;
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.profile = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ access_token: string }>) => {
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.access_token);
      })
      .addCase(getMyProfileInfo.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.profile = action.payload;
        console.log("Profile info fetched:", action.payload);
      })
      .addCase(createPost.fulfilled, (state) => {
        state.postsUpdatedTrigger = Date.now(); 
      })
      .addCase(deletePost.fulfilled, (state) => {
        state.postsUpdatedTrigger = Date.now(); 
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;