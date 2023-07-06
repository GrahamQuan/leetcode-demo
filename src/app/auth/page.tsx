import NavBar from '@/components/NavBar/NavBar'
import Image from 'next/image'
import type { FC } from 'react'

type Props = {}

const AuthPage: FC<Props> = (props) => {

  return (
    <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
      <div className="max-w-7xl mx-auto">
        <NavBar />
        <div className='flex justify-center items-center h-[calc(100vh-5rem)] pointer-events-none select-none'>
          <Image src='/hero.png' alt='LeetCode' width={700} height={700} />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
