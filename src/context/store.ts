import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import languageSlice from "./slices/languageSlice"; // Import the language slice reducer
import userSlice from "./slices/userSlice"; // Import the user slice reducer

export const store = configureStore({
  reducer: {
    language: languageSlice,
    user: userSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>() // Export a hook that can be reused to resolve types

export default store;