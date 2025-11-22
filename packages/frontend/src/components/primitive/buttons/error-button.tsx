import { Button } from '@headlessui/react'

function ErrorButton({ callback, children }: { callback?: () => void; children: React.ReactNode }) {
  return (
    <Button onClick={callback} className="px-4 py-2 rounded-lg transition-colors bg-red-700 hover:bg-red-600 active:bg-red-700">
      {children}
    </Button>
  )
}

export default ErrorButton

