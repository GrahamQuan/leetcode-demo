import type { FC } from 'react'
import { problems } from '@/utils/problems'
import { notFound } from 'next/navigation'
import Workspace from '@/components/Workspace/Workspace'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateStaticParams() {
  return Object.keys(problems).map((key) => ({
    pid: key,
  }))
}

const getProblemsData = async (key: string) => {
  if (!(key in problems)) return undefined

  const problem = problems[key]
  problem.handlerFunction = problem.handlerFunction.toString()
  return problem
}

export const dynamic = 'error'

type Props = {
  params: { pid: string }
}

export async function generateMetadata({
  params: { pid },
}: Props): Promise<Metadata> {
  return {
    title: pid
      .split('-')
      .map((word) => `${word.charAt(0).toUpperCase() + word.slice(1)}`)
      .join(' '),
  }
}

const Page: FC<Props> = async ({ params }) => {
  const { pid } = params
  const problem = await getProblemsData(pid)

  // TODO: bugs here when using wrong url with next.js 13.4.5
  if (!problem) {
    console.log('notFound()..')
    return notFound()
  }

  return <Workspace pid={pid} problem={problem} />
}

export default Page
