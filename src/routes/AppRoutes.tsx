import { Routes, Route } from 'react-router-dom'
import { MainGalleryPage } from '../pages/MainGalleryPage'
import { SoundboardPage } from '../pages/SoundboardPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainGalleryPage />} />
      <Route path="/soundboard" element={<SoundboardPage />} />
    </Routes>
  )
}
