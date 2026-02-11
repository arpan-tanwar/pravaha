import { Link } from 'react-router-dom'
import './mainGallery.css'

interface Experience {
  id: string
  title: string
  description: string
  path: string
  tags: string[]
  comingSoon?: boolean
}

const EXPERIENCES: Experience[] = [
  {
    id: 'soundboard',
    title: 'SoundBoard',
    description: 'Play sounds and visuals with A–Z keys. Record sequences, change scales and kits.',
    path: '/soundboard',
    tags: ['Audio', 'Visuals', 'Keys'],
  },
  {
    id: 'coming-1',
    title: 'More soon',
    description: 'New experiences and games will appear here.',
    path: '#',
    tags: ['Coming soon'],
    comingSoon: true,
  },
]

export function MainGalleryPage() {
  return (
    <div className="gallery">
      <div className="gallery-bg" aria-hidden />
      <header className="gallery-hero">
        <h1 className="gallery-title">Experiences</h1>
        <p className="gallery-desc">
          Fun, interactive demos and games. Pick one to dive in.
        </p>
        <p className="gallery-hint">Keyboard and touch friendly.</p>
      </header>
      <main className="gallery-grid">
        {EXPERIENCES.map((exp, i) => (
          <div
            key={exp.id}
            className={`gallery-card ${exp.comingSoon ? 'gallery-card--disabled' : ''}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {exp.comingSoon ? (
              <div className="gallery-card-inner">
                <h2 className="gallery-card-title">{exp.title}</h2>
                <p className="gallery-card-desc">{exp.description}</p>
                <div className="gallery-card-tags">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="gallery-tag">{tag}</span>
                  ))}
                </div>
                <span className="gallery-card-coming">Coming soon</span>
              </div>
            ) : (
              <Link to={exp.path} className="gallery-card-inner gallery-card-link">
                <h2 className="gallery-card-title">{exp.title}</h2>
                <p className="gallery-card-desc">{exp.description}</p>
                <div className="gallery-card-tags">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="gallery-tag">{tag}</span>
                  ))}
                </div>
                <span className="gallery-card-cta">Open</span>
              </Link>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}
