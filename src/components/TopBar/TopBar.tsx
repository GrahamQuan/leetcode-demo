'use client'

import { auth } from '@/firebase/firebase'
import Link from 'next/link'
import React from 'react'
import type { FC } from 'react'
import Image from 'next/image'
import { useAppDispatch } from '@/redux/hooks'
import { switchType, toggleOpen } from '@/redux/features/signinSlice'
import { useAuthState } from 'react-firebase-hooks/auth'
import LogOutButton from '../Btns/LogOut'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { BsList } from 'react-icons/bs'
import Timer from '../Timer/Timer'
import { problems } from '@/utils/problems'
import type { Problem } from '@/utils/types/problem'
import { useRouter } from 'next/navigation'

type TopbarProps = {
  problemPage?: boolean
  pid?: string
}

const Topbar: FC<TopbarProps> = ({ problemPage, pid }) => {
  const [user] = useAuthState(auth)

  const dispatch = useAppDispatch()
  const router = useRouter()

  const goSignin = () => {
    dispatch(toggleOpen())
    dispatch(switchType())
  }

  const handleProblemChange = (isForward: boolean) => {
    const { order } = problems[pid!]
    const direction = isForward ? 1 : -1
    const nextProblemOrder = order + direction
    const nextProblemKey = Object.keys(problems).find(
      (key) => problems[key].order === nextProblemOrder
    )
    if (isForward && !nextProblemKey) {
      const firstProblemKey = Object.keys(problems).find(
        (key) => problems[key].order === 1
      )
      router.push(`/problems/${firstProblemKey}`)
    } else if (!isForward && !nextProblemKey) {
      const lastProblemKey = Object.keys(problems).find(
        (key) => problems[key].order === Object.keys(problems).length
      )
      router.push(`/problems/${lastProblemKey}`)
    } else {
      router.push(`/problems/${nextProblemKey}`)
    }
  }

  return (
    <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7">
      <div
        className={`flex w-full items-center justify-between ${
          !problemPage ? 'max-w-[1200px] mx-auto' : ''
        }`}
      >
        <Link href="/" className="h-[22px] flex-1">
          <Image src="/logo-full.png" alt="Logo" height={100} width={100} />
        </Link>
        {problemPage && (
          <div className="flex items-center justify-center gap-4 flex-1">
            <div
              onClick={() => handleProblemChange(false)}
              className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 hover:text-white h-8 w-8 cursor-pointer"
            >
              <FaChevronLeft />
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer hover:text-white"
            >
              <div>
                <BsList />
              </div>
              <div>Problems List</div>
            </Link>
            <div
              onClick={() => handleProblemChange(true)}
              className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 hover:text-white h-8 w-8 cursor-pointer"
            >
              <FaChevronRight />
            </div>
          </div>
        )}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          {user ? (
            <>
              {problemPage && <Timer />}
              <div className="cursor-pointer group relative">
                <Image
                  src={'/avatar.png'}
                  alt="user avatar"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div
                  className="absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg 
								z-40 group-hover:scale-100 scale-0 
								transition-all duration-300 ease-in-out"
                >
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              <LogOutButton />
            </>
          ) : (
            <Link href="/auth" onClick={goSignin}>
              <button className="bg-dark-fill-3 py-1 px-2 cursor-pointer rounded hover:bg-dark-fill-2">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
export default Topbar
