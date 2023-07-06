'use client'
import { useState } from 'react'
import ProblemsTable from '@/components/ProblemTable.tsx/ProblemTable'
import Topbar from '@/components/TopBar/TopBar'
import useHasMounted from '@/hooks/useHasMounted'
import { IoClose } from 'react-icons/io5'
import YouTube from 'react-youtube'
import Modal from '@/components/Modal/Modal'

export type youtube = {
  isOpen: boolean
  videoId: string
}

export default async function Home() {
  const [loading, setLoading] = useState(true)
  const hasMounted = useHasMounted()

  const [youtubePlayer, setYoutubePlayer] = useState<youtube>({
    isOpen: false,
    videoId: '',
  })

  const closeModal = () => {
    setYoutubePlayer({
      isOpen: false,
      videoId: '',
    })
  }

  if (!hasMounted) return null

  return (
    <main className="bg-dark-layer-2 min-h-screen">
      <Topbar />
      <h1
        className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium
					uppercase mt-10 mb-5"
      >
        &ldquo; Have a Try &rdquo; 👇
      </h1>
      <div className="relative overflow-x-auto mx-auto px-6 pb-10">
        <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto">
          {loading ? (
            <tbody>
              {[...Array(10)].map((_, index) => (
                <tr
                  key={index}
                  className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse flex items-center space-x-12 mt-4 px-6"
                >
                  <LoadingSkeleton />
                </tr>
              ))}
            </tbody>
          ) : (
            <>
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
                <tr>
                  <th scope="col" className="px-1 py-3 w-0 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Difficulty
                  </th>

                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Solution
                  </th>
                </tr>
              </thead>
            </>
          )}
          <ProblemsTable
            setLoading={setLoading}
            setYoutubePlayer={setYoutubePlayer}
          />
        </table>
        <Modal visible={youtubePlayer.isOpen} onClose={closeModal}>
          {youtubePlayer.isOpen ? (
            <>
              <div
                className="bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute"
                onClick={closeModal}
              ></div>
              <div className="w-full z-50 h-full px-6 relative max-w-4xl">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="w-full relative">
                    <IoClose
                      fontSize={35}
                      className="cursor-pointer absolute -top-16 right-0 text-gray-400 hover:text-white"
                      onClick={closeModal}
                    />
                    <YouTube
                      videoId={youtubePlayer.videoId}
                      loading="lazy"
                      iframeClassName="w-full min-h-[500px]"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </Modal>
      </div>
    </main>
  )
}

const LoadingSkeleton = () => {
  return (
    <>
      <td className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1"></td>
      <td className="h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1"></td>
      <td className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1"></td>
      <td className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1"></td>
    </>
  )
}
