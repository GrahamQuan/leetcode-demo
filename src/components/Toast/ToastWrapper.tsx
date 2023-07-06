'use client'

import type { FC, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Props = {
  children: ReactNode
}

const ToastWrapper: FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}

export default ToastWrapper
