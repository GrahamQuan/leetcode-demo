import { auth } from '@/firebase/firebase'
import type { SigninType } from '@/redux/features/signinSlice'
import { switchType } from '@/redux/features/signinSlice'
import { useAppDispatch } from '@/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import type { ChangeEvent, FC, FormEvent } from 'react'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { toast } from 'react-toastify'

type LoginProps = {}

const Login: FC<LoginProps> = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
  })
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth)

  const handleSwitch = (type: SigninType['type']) => {
    dispatch(switchType(type))
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userInput.email || !userInput.email) {
      return toast.error('please fill all fields', {
        hideProgressBar: true,
      })
    }
    try {
      const newUser = await signInWithEmailAndPassword(
        userInput.email,
        userInput.password
      )
      if (!newUser) return
      router.push('/')
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
      })
    }
  }

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleSubmit}>
      <h3 className="text-xl font-medium text-white">Sign in to LeetClone</h3>
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
      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Your Password
        </label>
        <input
          onChange={handleInput}
          type="password"
          name="password"
          id="password"
          className="
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
        "
          placeholder="*******"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`${
          loading ? 'pointer-events-none' : ''
        } w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s`}
      >
        {loading ? 'Loading...' : 'Log In'}
      </button>
      <button
        className="flex w-full justify-end"
        onClick={() => handleSwitch('forgotPassword')}
      >
        <a
          href="#"
          className="text-sm block text-brand-orange hover:underline w-full text-right"
        >
          Forgot Password?
        </a>
      </button>
      <div className="text-sm font-medium text-gray-300">
        Not Registered?{' '}
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={() => handleSwitch('register')}
        >
          Create an account
        </a>
      </div>
    </form>
  )
}
export default Login
