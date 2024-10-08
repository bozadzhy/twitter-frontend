import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});
export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});
export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => await axios.delete(`/posts/${id}`)
);

export const fetchCreateComment = createAsyncThunk(
  "posts/fetchCreateComment",
  async ({ id, body }) => {
    const { data } = await axios.post(`/posts/${id}/comments`, { body });
    return { id, comment: data }; // Return the post ID and the new comment
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const PostsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    // posts
    // pending - загрузка идет
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    // fulfilled - загрузка завершилась успешно
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    // rejected - ошибка загрузки
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    // tags
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    // comments
    [fetchCreateComment.fulfilled]: (state, action) => {
      const { id, comment } = action.payload;
      const post = state.posts.items.find((post) => post._id === id);
      if (post) {
        post.comments.push(comment);
      }
    },
    [fetchCreateComment.rejected]: (state, action) => {
      console.error("Error adding comment:", action.error.message);
    },

    // delete post
    [fetchRemovePost.pending]: (state, action) => {
      // meta.arg- из редакса для корректоного удаления
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
  },
});

export const postsReducer = PostsSlice.reducer;
