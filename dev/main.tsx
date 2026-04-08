import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Tabs from '../src/tabs'
import type { Tab } from '../src/tabs'
import './tailwind.css'

const Section = ({ title, bg, children }: { title: string; bg?: string; children: React.ReactNode }) => (
    <div className={`rounded-xl p-5 ${bg || 'bg-white'} shadow-sm border border-gray-200`}>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h2>
        {children}
    </div>
)

const reportTabs: Tab[] = [
    { id: 'perfil', label: 'Perfil' },
    { id: 'situacion', label: 'Situaci\u00f3n' },
    { id: 'resumen', label: 'Resumen' },
]

const personTabs: Tab[] = [
    { id: 'p1', label: 'Andr\u00e9s Vidal Lara' },
    { id: 'p2', label: 'Mar\u00eda Gonz\u00e1lez' },
    { id: 'p3', label: 'a b' },
]

const creditTabs: Tab[] = [
    { id: 'prop', label: 'Propiedad', shortLabel: 'Prop.' },
    { id: 'fin', label: 'Financiamiento', shortLabel: 'Financ.' },
]

const modalTabs: Tab[] = [
    { id: 'eval', label: 'Evaluaci\u00f3n' },
    { id: 'carpeta', label: 'Carpeta' },
    { id: 'autonoma', label: 'Aut\u00f3noma' },
]

const roleTabs: Tab[] = [
    { id: 'titular', label: 'Titular', icon: 'User' },
    { id: 'codeudor', label: 'Codeudor', icon: 'Users' },
]

const iconTabs: Tab[] = [
    { id: 'overview', label: 'Vista general', icon: 'LayoutDashboard' },
    { id: 'docs', label: 'Documentos', icon: 'FileText' },
    { id: 'settings', label: 'Configuraci\u00f3n', icon: 'Settings' },
]

const truncationTabs: Tab[] = [
    { id: 't1', label: 'Simulaci\u00f3n de Cr\u00e9dito Hipotecario' },
    { id: 't2', label: 'Evaluaci\u00f3n Financiera Completa' },
    { id: 't3', label: 'Resumen Ejecutivo del An\u00e1lisis' },
]

const App = () => {
    const [report, setReport] = useState('perfil')
    const [person, setPerson] = useState('p1')
    const [credit, setCredit] = useState('prop')
    const [modal, setModal] = useState('eval')
    const [role, setRole] = useState('titular')
    const [icon, setIcon] = useState('overview')
    const [trunc, setTrunc] = useState('t1')
    const [darkRole, setDarkRole] = useState('titular')
    const [darkIcon, setDarkIcon] = useState('overview')

    return (
        <div className="max-w-3xl mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold">Tabs — Visual Test</h1>
            <p className="text-gray-500 text-sm">All variants of the unified Tabs component.</p>

            <Section title="Default — Report tabs">
                <Tabs tabs={reportTabs} activeTab={report} onChange={setReport} />
            </Section>

            <Section title="Default — Person names (dynamic lengths)">
                <Tabs tabs={personTabs} activeTab={person} onChange={setPerson} />
            </Section>

            <Section title="Default — Modal tabs (3 tabs)">
                <Tabs tabs={modalTabs} activeTab={modal} onChange={setModal} />
            </Section>

            <Section title="Default — With icons">
                <Tabs tabs={iconTabs} activeTab={icon} onChange={setIcon} />
            </Section>

            <Section title="Violet — Role selector (RolePill replacement)">
                <Tabs tabs={roleTabs} activeTab={role} onChange={setRole} colorSet="violet" />
            </Section>

            <Section title="Default — Truncation stress test (hover for full label)">
                <Tabs tabs={truncationTabs} activeTab={trunc} onChange={setTrunc} />
            </Section>

            <Section title="Dark — Credit modal (shortLabels)" bg="bg-gray-800">
                <Tabs tabs={creditTabs} activeTab={credit} onChange={setCredit} dark />
            </Section>

            <Section title="Dark — With icons" bg="bg-gray-800">
                <Tabs tabs={iconTabs} activeTab={darkIcon} onChange={setDarkIcon} dark />
            </Section>

            <Section title="Dark + Violet (dark overrides colorSet)" bg="bg-gray-800">
                <Tabs tabs={roleTabs} activeTab={darkRole} onChange={setDarkRole} dark colorSet="violet" />
            </Section>

            <Section title="Suffix — Report tabs with counts">
                <Tabs
                    tabs={reportTabs}
                    activeTab={report}
                    onChange={setReport}
                    suffix={(id) => id === 'perfil' ? ' (3/5)' : id === 'situacion' ? ' (2/4)' : ''}
                />
            </Section>
        </div>
    )
}

createRoot(document.getElementById('root')!).render(<App />)
