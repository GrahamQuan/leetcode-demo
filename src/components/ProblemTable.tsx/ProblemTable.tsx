import React, { useEffect, useState } from 'react'
import type { Dispatch, FC, SetStateAction } from 'react'
import { BsCheckCircle } from 'react-icons/bs'
import { AiFillYoutube } from 'react-icons/ai'
import Link from 'next/link'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore'
import { auth, firestore } from '@/firebase/firebase'
import type { DBProblem } from '@/utils/types/problem'
import { useAuthState } from 'react-firebase-hooks/auth'
import type { youtube } from '@/app/page'

type Props = {
  setLoading: Dispatch<SetStateAction<boolean>>
  setYoutubePlayer: Dispatch<SetStateAction<youtube>>
}

const ProblemsTable: FC<Props> = ({ setLoading, setYoutubePlayer }) => {
  
  const solvedProblems = useGetSolvedProblems()

  const problems = useGetProblems(setLoading)

  return (
    <tbody className="text-white">
      {problems.map((problem, idx) => {
        const difficulyColor =
          problem.difficulty === 'Easy'
            ? 'text-dark-green-s'
            : problem.difficulty === 'Medium'
            ? 'text-dark-yellow'
            : 'text-dark-pink'

        return (
          <tr key={problem.id} className="even:bg-dark-layer-1">
            <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
              {solvedProblems.includes(problem.id) && (
                <BsCheckCircle fontSize={18} width={18} />
              )}
            </th>
            <td className="px-6 py-4">
              {problem.link ? (
                <Link
                  href={problem.link}
                  className="hover:text-blue-600 cursor-pointer"
                  target="_blank"
                >
                  {problem.title}
                </Link>
              ) : (
                <Link
                  className="hover:text-blue-600 cursor-pointer"
                  href={`/problems/${problem.id}`}
                >
                  {problem.title}
                </Link>
              )}
            </td>
            <td className={`px-6 py-4 ${difficulyColor}`}>
              {problem.difficulty}
            </td>
            <td className="px-6 py-4">{problem.category}</td>
            <td className="px-6 py-4">
              {problem.videoId ? (
                <AiFillYoutube
                  fontSize={'28'}
                  className="cursor-pointer hover:text-red-600"
                  onClick={() =>
                    setYoutubePlayer({
                      isOpen: true,
                      videoId: problem.videoId as string,
                    })
                  }
                />
              ) : (
                <>Coming soon</>
              )}
            </td>
          </tr>
        )
      })}
    </tbody>
  )
}

export default ProblemsTable

async function getData() {
  const q = query(collection(firestore, 'problems'), orderBy('order', 'asc'))
  const querySnapshot = await getDocs(q)
  const DBProblems: DBProblem[] = []
  querySnapshot.forEach((doc) => {
    DBProblems.push({ ...doc.data() } as DBProblem)
  })
  // console.log('DBProblems', DBProblems)
  return DBProblems
}

const useGetProblems = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const [problems, setProblems] = useState<DBProblem[]>([])

  const fetchData = async () => {
    setLoading(true)
    const DBProblems = await getData()
    setProblems(DBProblems)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    return () => {}
  }, [setLoading])

  return problems
}

function useGetSolvedProblems() {
  const [solvedProblems, setSolvedProblems] = useState<string[]>([])
  const [user] = useAuthState(auth)

  useEffect(() => {
    const getSolvedProblems = async () => {
      const userRef = doc(firestore, 'users', user!.uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        setSolvedProblems(userDoc.data().solvedProblems)
      }
    }

    if (user) getSolvedProblems()
    if (!user) setSolvedProblems([])
  }, [user])

  return solvedProblems
}
