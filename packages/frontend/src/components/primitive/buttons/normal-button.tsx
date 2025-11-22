import { Button } from '@headlessui/react'

function NormalButton({ callback, children }: { callback?: () => void; children: React.ReactNode }) {
  return (
    <Button onClick={callback} className="px-4 py-2 rounded-lg transition-colors bg-stone-400 hover:bg-stone-300 active:bg-stone-400">
      {children}
    </Button>
  )
}

export default NormalButton

