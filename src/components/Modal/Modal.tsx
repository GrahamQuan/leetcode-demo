import React, { useEffect } from 'react'
import type { FC, ReactNode } from 'react'

type Props = {
  visible: boolean
  onClose: Function
  children: ReactNode
}

const Modal: FC<Props> = (props) => {
  const { visible = false, children } = props

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  })

  const closeModal = () => {
    const { onClose } = props
    if (onClose) {
      onClose()
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 ${
        visible ? '' : 'hidden'
      }`}
    >
      {children}
    </div>
  )
}

export default Modal
