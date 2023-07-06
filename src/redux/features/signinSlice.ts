import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SigninType = {
  isOpen: boolean
  type: 'login' | 'register' | 'forgotPassword'
}

const initialState = {
  isOpen: false,
  type: 'login',
} as SigninType

export const signin = createSlice({
  name: 'login',
  initialState,
  reducers: {
    toggleOpen: (state) => {
      state.isOpen = !state.isOpen
    },
    switchType: (state, action: PayloadAction<SigninType['type'] | undefined>) => {
      if (action.payload) {
        state.type = action.payload
      } else {
        state.type = 'login'
      }
    }
  },
})

export const { switchType, toggleOpen } = signin.actions
export default signin.reducer
