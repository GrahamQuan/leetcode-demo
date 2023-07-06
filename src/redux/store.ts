import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/couterSlice'
import signinReducer from './features/signinSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    signin: signinReducer,
  },
  // devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
