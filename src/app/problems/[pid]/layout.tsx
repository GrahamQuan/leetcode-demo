import Topbar from '@/components/TopBar/TopBar'
import type { FC, ReactNode } from 'react'

type Props = {
  params: { pid: string }
  children: ReactNode
}

const Layout: FC<Props> = ({ children, params }) => {
  const { pid } = params

  return (
    <>
      <Topbar problemPage pid={pid} />
      {children}
    </>
  )
}

export default Layout
