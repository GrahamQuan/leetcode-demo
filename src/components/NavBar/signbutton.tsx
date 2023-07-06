'use client'

import React from 'react'
import type { FC } from 'react'
import Modal from '../Modal/Modal'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Login from './modal/Login'
import SignUp from './modal/SignUp'
import ResetPwd from './modal/ResetPwd'
import { switchType, toggleOpen } from '@/redux/features/signinSlice'
import { IoClose } from 'react-icons/io5'

type Props = {}

const SignInButton: FC<Props> = (props) => {
  // const { isOpen, type } = useAppSelector((state) => state.signin)
  const isOpen = useAppSelector((state) => state.signin.isOpen)
  const type = useAppSelector((state) => state.signin.type)
  const dispatch = useAppDispatch()

  const openSignInModal = () => {
    dispatch(toggleOpen())
  }
  const onClose = () => {
    dispatch(toggleOpen())
    dispatch(switchType())
  }

  return (
    <>
      <button
        className="bg-brand-orange text-white px-2 py-1 sm:px-4 rounded-md text-sm font-medium hover:text-brand-orange hover:bg-white hover:border-2 hover:border-brand-orange border-2 border-transparent transition duration-300 ease-in-out"
        onClick={openSignInModal}
      >
        Sign In
      </button>
      <Modal visible={isOpen} onClose={onClose}>
        <div className="absolute min-h-screen w-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex justify-center items-center">
          <div className="sm:w-[450px] bg-white rounded-lg shadow relative w-full bg-gradient-to-b from-brand-orange to-slate-900 mx-6">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-500 hover:text-white text-white"
                onClick={onClose}
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>
            {type === 'login' ? (
              <Login />
            ) : type === 'register' ? (
              <SignUp />
            ) : (
              <ResetPwd />
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SignInButton
