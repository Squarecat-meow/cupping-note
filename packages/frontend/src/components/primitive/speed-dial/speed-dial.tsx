import { Coffee, NotebookPen, PlusIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const actions = [
  { id: 1, icon: <Coffee size={32} />, name: '레시피' },
  { id: 2, icon: <NotebookPen size={32} />, name: '커핑노트' },
]

function SpeedDial() {
  const [isActionVisible, setIsActionVisible] = useState(false)
  const speedDialButtonRef = useRef<HTMLDivElement>(null)

  const toggleDialClick = () => {
    setIsActionVisible((state) => !state)
  }
  const handleMouseDown = (e: MouseEvent) => {
    if (e.target !== speedDialButtonRef.current) {
      setIsActionVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  })

  return (
    <nav className="relative" ref={speedDialButtonRef}>
      <button
        type="button"
        className="w-12 grid place-items-center fixed right-4 bottom-4 aspect-square rounded-full bg-stone-500 shadow-lg"
        onClick={toggleDialClick}
      >
        <PlusIcon />
      </button>
      {isActionVisible && (
        <ul className="fixed right-4 bottom-20 flex flex-col items-center gap-2">
          {actions.map((action) => (
            <li key={action.id} className="flex flex-col items-center">
              <button type="button" className="p-2 rounded-full transition-colors hover:bg-stone-300">
                {action.icon}
              </button>
              <span className="flex items-center gap-2 text-xs">{action.name}</span>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default SpeedDial
