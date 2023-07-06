'use client'
import React, { useState } from 'react'
import type { FC } from 'react'
import Description from './Description/Description'
import Playground from './Playground/Playground'
import Split from 'react-split'
import Confetti from 'react-confetti'
import useWindowSize from '../../hooks/useWindowSize'
import type { Problem } from '../../utils/types/problem'

type Props = {
  pid: string
  problem: Problem
}

const Workspace: FC<Props> = ({ pid, problem }) => {
  const [showConfetti, setShowConfetti] = useState(false)
  const [success, setSuccess] = useState(false)
  const { width, height } = useWindowSize()

  return (
    <Split className="split" minSize={0}>
      <Description problem={problem} success={success} />
      <div className="bg-dark-fill-2">
        <Playground
          pid={pid}
          problem={problem}
          setSuccess={setSuccess}
          setShowConfetti={setShowConfetti}
        />
        {showConfetti && (
          <Confetti
            gravity={0.3}
            tweenDuration={4000}
            width={width - 1}
            height={height - 1}
          />
        )}
      </div>
    </Split>
  )
}

export default Workspace
