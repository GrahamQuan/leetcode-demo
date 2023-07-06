import React, { useEffect, useState } from 'react'
import type { Dispatch, FC, SetStateAction } from 'react'
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSetting,
} from 'react-icons/ai'
import type { Settings } from '../Playground'
import SettingsModal from '@/components/SettingModal/SettingModal'

type Props = {
  settings: Settings
  setSettings: Dispatch<SetStateAction<Settings>>
}

const PlaygroundNav: FC<Props> = ({ settings, setSettings }) => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    function exitHandler(e: any) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false)
        return
      }
      setIsFullScreen(true)
    }

    if (document.addEventListener) {
      document.addEventListener('fullscreenchange', exitHandler)
      document.addEventListener('webkitfullscreenchange', exitHandler)
      document.addEventListener('mozfullscreenchange', exitHandler)
      document.addEventListener('MSFullscreenChange', exitHandler)
    }
  }, [isFullScreen])

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
    setIsFullScreen(!isFullScreen)
  }

  const handleSetting = () => {
    setSettings({ ...settings, settingsModalIsOpen: true })
  }

  return (
    <div className="flex items-center justify-between bg-dark-layer-2 h-11 w-full ">
      <div className="flex items-center text-white">
        <button className="flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2  px-2 py-1.5 font-medium">
          <div className="flex items-center px-1">
            <div className="text-xs text-label-2 dark:text-dark-label-2">
              JavaScript
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center m-2" onClick={handleSetting}>
        <button className="tooltipBtn group" onClick={handleSetting}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineSetting />
          </div>
          <div className="tooltip">Settings</div>
        </button>

        <button className="tooltipBtn group" onClick={handleFullScreen}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            {!isFullScreen ? (
              <AiOutlineFullscreen />
            ) : (
              <AiOutlineFullscreenExit />
            )}
          </div>
          <div className="tooltip">
            {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          </div>
        </button>
      </div>
      {settings.settingsModalIsOpen && (
        <SettingsModal settings={settings} setSettings={setSettings} />
      )}
    </div>
  )
}

export default PlaygroundNav
