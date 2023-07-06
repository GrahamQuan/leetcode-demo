import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import SignInButton from './signbutton'

type NavBarProps = {}

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <nav className="flex items-center justify-between sm:px-12 px-2 md:px-24">
      <Link href={'/'} className="flex items-center justify-center h-20">
        <Image src="/logo.png" alt="LeetCode" width={200} height={200} />
      </Link>
      <SignInButton />
    </nav>
  )
}

export default NavBar
