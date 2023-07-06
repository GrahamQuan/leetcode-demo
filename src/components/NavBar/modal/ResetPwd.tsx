import { auth } from '@/firebase/firebase'
import type { SigninType } from '@/redux/features/signinSlice'
import { switchType } from '@/redux/features/signinSlice'
import { useAppDispatch } from '@/redux/hooks'
import React, { useEffect, useState } from 'react'
import type { ChangeEvent, FC, FormEvent } from 'react'
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth'
// import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
type LoginProps = {}

const ResetPwd: FC<LoginProps> = () => {
  const [email, setEmail] = useState('')
  const dispatch = useAppDispatch()
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth)

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        hideProgressBar: true,
      })
    }
  }, [error])

  const handleSwitch = (type: SigninType['type']) => {
    dispatch(switchType(type))
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const isSend = await sendPasswordResetEmail(email)
      if (isSend) {
        toast.success('Email sended, please check your email', {
          position: 'top-center',
          hideProgressBar: true,
        })
      }
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
      })
    }
  }

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleSubmit}>
      <h3 className="text-xl font-medium text-white">Reset Password</h3>
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Your Email
        </label>
        <input
          onChange={handleInput}
          type="email"
          name="email"
          id="email"
          className="
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
        "
          placeholder="xxx@yyy.com"
        />
      </div>
      <button
        type="submit"
        className={`${
          sending ? 'pointer-events-none' : ''
        } w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s`}
      >
        reset
      </button>
      <div className="text-sm font-medium text-gray-300">
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={() => handleSwitch('login')}
        >
          back to login
        </a>
      </div>
    </form>
  )
}
export default ResetPwd
