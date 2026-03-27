import { createRoot } from 'react-dom/client'
import './tailwind.css'
const App = () => (
    <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">@jogi/ui</h1>
        <p className="text-gray-500">Component playground — add visual tests here as components are migrated.</p>
    </div>
)

createRoot(document.getElementById('root')!).render(<App />)
