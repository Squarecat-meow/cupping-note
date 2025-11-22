import { Button } from '@headlessui/react'

function OutlineButton({ callback, children }: { callback?: () => void; children: React.ReactNode }) {
  return (
    <Button
      onClick={callback}
      className="px-4 py-2 border rounded-lg transition-colors border-stone-400 hover:border-stone-500 hover:bg-stone-500 active:border-stone-400 active:bg-stone-400"
    >
      {children}
    </Button>
  )
}

export default OutlineButton

