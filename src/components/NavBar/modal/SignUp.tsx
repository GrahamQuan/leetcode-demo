import { auth, firestore } from '@/firebase/firebase'
import type { SigninType } from '@/redux/features/signinSlice'
import { switchType } from '@/redux/features/signinSlice'
import { useAppDispatch } from '@/redux/hooks'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import type { ChangeEvent, FC, FormEvent } from 'react'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { toast } from 'react-toastify'
type LoginProps = {}

const SignUp: FC<LoginProps> = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
    displayName: '',
  })

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth)

  const handleSwitch = (type: SigninType['type']) => {
    dispatch(switchType(type))
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userInput.displayName || !userInput.email || !userInput.email) {
      return toast.error('please fill all fields', {
        hideProgressBar: true,
      })
    }
    try {
      const newUser = await createUserWithEmailAndPassword(
        userInput.email,
        userInput.password
      )
      if (!newUser) return

      const userData = {
        uid: newUser.user.uid,
        email: newUser.user.email,
        displayName: userInput.displayName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        likedProblems: [],
        dislikedProblems: [],
        solvedProblems: [],
        starredProblems: [],
      }
      await setDoc(doc(firestore, 'users', newUser.user.uid), userData)
      router.push('/')
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
      })
    }
  }

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleSubmit}>
      <h3 className="text-xl font-medium text-white">Register to LeetClone</h3>
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
          htmlFor="displayName"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Display Name
        </label>
        <input
          onChange={handleInput}
          type="displayName"
          name="displayName"
          id="displayName"
          className="
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
        "
          placeholder="xxx"
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
        className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s
            "
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
      <div className="text-sm font-medium text-gray-300">
        Already have an account?{' '}
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={() => handleSwitch('login')}
        >
          Log In
        </a>
      </div>
    </form>
  )
}
export default SignUp
