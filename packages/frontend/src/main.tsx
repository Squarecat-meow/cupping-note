import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import './index.css'
import MainLayout from './pages/main-layout.tsx'
import Note from './pages/note.tsx'
import Recipe from './pages/recipe.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<App />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/note" element={<Note />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
