import SmallCard from './components/primitive/cards/small-card'
import SpeedDial from './components/primitive/speed-dial/speed-dial'

function App() {
  return (
    <section className="p-2 flex flex-col gap-2">
      <ul className="space-y-2">
        <SmallCard>레시피1</SmallCard>
        <SmallCard>레시피2</SmallCard>
        <SmallCard>레시피3</SmallCard>
      </ul>
      <SpeedDial />
    </section>
  )
}

export default App
