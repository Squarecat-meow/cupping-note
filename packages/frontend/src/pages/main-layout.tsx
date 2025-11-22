import { Outlet } from 'react-router'
import SpeedDial from '../components/primitive/speed-dial/speed-dial'

function MainLayout() {
  return (
    <main>
      <header className="h-14 p-4 flex gap-2 bg-stone-300">
        <span className="font-bold">Coffing Note</span>
      </header>
      <Outlet />
      <SpeedDial />
    </main>
  )
}

export default MainLayout
