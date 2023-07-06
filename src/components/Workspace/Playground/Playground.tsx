import React, { useEffect, useState } from 'react'
import type { FC, Dispatch, SetStateAction } from 'react'
import Split from 'react-split'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import PlaygroundNav from './PlaygroundNav/PlaygroundNav'
import EditorFooter from './EditorFooter'
import type { Problem } from '@/utils/types/problem'
import { problems } from '@/utils/problems'
import { toast } from 'react-toastify'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { auth, firestore } from '@/firebase/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import useLocalStorage from '@/hooks/useLocalStorage'

type Props = {
  pid: string
  problem: Problem
  setShowConfetti: Dispatch<SetStateAction<boolean>>
  setSuccess: Dispatch<SetStateAction<boolean>>
}

export type Settings = {
  fontSize: string
  settingsModalIsOpen: boolean
  dropdownIsOpen: boolean
}

const Playground: FC<Props> = ({
  pid,
  problem,
  setShowConfetti,
  setSuccess,
}) => {
  const [fontSize, setFontSize] = useLocalStorage('lcc-fontSize', '16px')

  const [settings, setSettings] = useState<Settings>({
    fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  })

  const [activeTestCaseId, setActiveTestCaseId] = useState(0)
  const [userCode, setUserCode] = useState(problem.starterCode)
  const [user] = useAuthState(auth)

  useEffect(() => {
    const code = localStorage.getItem(`code-${pid}`)
    if (user) {
      setUserCode(code ? JSON.parse(code) : problem.starterCode)
    } else {
      setUserCode(problem.starterCode)
    }
  }, [pid, user, problem.starterCode])

  const typingCode = (code: string) => {
    setUserCode(code)
    localStorage.setItem(`code-${pid}`, JSON.stringify(code))
  }

  const onSubmit = async () => {
    if (!user) {
      toast.error('Please login to submit your code', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'dark',
      })
      return
    }

    try {
      const pureCode = userCode.slice(
        userCode.indexOf(problem.starterFunctionName)
      )
      const cb = new Function(`return ${pureCode}`)()
      const handlerFunc = problems[pid].handlerFunction
      if (typeof handlerFunc === 'function') {
        const success = handlerFunc(cb)
        if (success) {
          toast.success('Congrats! All tests passed!', {
            position: 'top-center',
            autoClose: 3000,
            theme: 'dark',
          })
          setShowConfetti(true)
          setTimeout(() => {
            setShowConfetti(false)
          }, 4000)
          setSuccess(true)
          const userRef = doc(firestore, 'users', user.uid)
          await updateDoc(userRef, {
            solvedProblems: arrayUnion(pid),
          })
        }
      }
    } catch (error: any) {
      if (
        error.message.startsWith(
          'AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:'
        )
      ) {
        toast.error('Oops! One or more test cases failed', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'dark',
        })
      } else {
        toast.error(error.message, {
          position: 'top-center',
          autoClose: 3000,
          theme: 'dark',
        })
      }
    }
  }

  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
      <PlaygroundNav settings={settings} setSettings={setSettings}/>
      <Split
        className="h-[calc(100vh-94px)]"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        <div className="w-full overflow-hidden">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            extensions={[javascript()]}
            onChange={typingCode}
            style={{ fontSize: settings.fontSize }}
          />
        </div>
        <div className="w-full px-5 overflow-auto">
          {/* testcase heading */}
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">
                Testcases
              </div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
            </div>
          </div>

          <div className="flex">
            {problem.examples.map((example, index) => (
              <div
                className="mr-2 items-start mt-2 "
                key={example.id}
                onClick={() => setActiveTestCaseId(index)}
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  <div
                    className={`
                      font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										  ${activeTestCaseId === index ? 'text-white' : 'text-gray-500'}
									  `}
                  >
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].inputText}
            </div>
            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].outputText}
            </div>
          </div>
        </div>
      </Split>
      <EditorFooter onSubmit={onSubmit} />
    </div>
  )
}

export default Playground
