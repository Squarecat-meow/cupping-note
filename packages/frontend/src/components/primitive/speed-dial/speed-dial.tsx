import { Coffee, NotebookPen, PlusIcon } from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router'

const actions = [
  {
    id: 1,
    icon: <Coffee size={32} className="pointer-events-none" />,
    name: '레시피',
    path: '/recipe',
  },
  {
    id: 2,
    icon: <NotebookPen size={32} className="pointer-events-none" />,
    name: '커핑노트',
    path: '/note',
  },
]

function SpeedDial() {
  const [isActionVisible, setIsActionVisible] = useState(false)
  const speedDialButtonRef = useRef<HTMLButtonElement>(null)
  const speedDialActionsRef = useRef<HTMLButtonElement[]>([])

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (
        !speedDialButtonRef.current?.contains(e.target as Node) &&
        speedDialActionsRef.current.every((ref) => !ref.contains(e.target as Node))
      ) {
        setIsActionVisible(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return (
    <nav className="relative">
      <button
        type="button"
        className="w-12 grid place-items-center fixed right-4 bottom-4 aspect-square rounded-full bg-stone-500 shadow-lg"
        onClick={() => setIsActionVisible((state) => !state)}
        ref={speedDialButtonRef}
      >
        <PlusIcon className="pointer-events-none" />
      </button>
      {isActionVisible && (
        <ul className="fixed right-4 bottom-20 flex flex-col items-center gap-2">
          {actions.map((action, index) => (
            <li key={action.id}>
              <NavLink to={action.path} className="flex flex-col items-center" onClick={() => setIsActionVisible(false)}>
                <button
                  type="button"
                  className="p-2 rounded-full transition-colors hover:bg-stone-300"
                  ref={(el) => {
                    if (el) speedDialActionsRef.current[index] = el
                    else delete speedDialActionsRef.current[index]
                  }}
                >
                  {action.icon}
                </button>
                <span className="flex items-center gap-2 text-xs">{action.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default memo(SpeedDial)
