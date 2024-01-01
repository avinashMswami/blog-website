import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  image_url: ""
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setComments: (state, action) => {
      const postId = action.payload.postId;
      const newComments = action.payload.comments;
    
      // Find the post by postId
      const updatedPosts = state.posts.map((post) => {
        if (post._id === postId) {
          // Update the comments for the found post
          post.comments = newComments;
        }
        return post;
      });
    
      state.posts = updatedPosts;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setImage_url: (state,action)=>{
      state.image_url = action.payload.url;
    }
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setComments, setImage_url } =
  authSlice.actions;
export default authSlice.reducer;
