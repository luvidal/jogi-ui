import type { Config } from 'tailwindcss'

const withAlpha = (v: string) => `rgb(var(${v}) / <alpha-value>)`

const config: Config = {
    content: [
        './src/**/*.{ts,tsx}',
        './dev/**/*.{html,tsx}',
    ],
    theme: { extend: {
        colors: {
            theme: {
                50:  withAlpha('--theme-50'),
                100: withAlpha('--theme-100'),
                200: withAlpha('--theme-200'),
                300: withAlpha('--theme-300'),
                400: withAlpha('--theme-400'),
                500: withAlpha('--theme-500'),
                600: withAlpha('--theme-600'),
                700: withAlpha('--theme-700'),
                800: withAlpha('--theme-800'),
                900: withAlpha('--theme-900'),
                950: withAlpha('--theme-950'),
            },
            // Semantic status tokens. Consumer (host) ships the values via
            // --status-* CSS vars; the satellite's dev sandbox defines them
            // in dev/tailwind.css so this Vite preview can render too.
            status: {
                ok:                 withAlpha('--status-ok'),
                'ok-muted':         withAlpha('--status-ok-muted'),
                'ok-contrast':      withAlpha('--status-ok-contrast'),
                warn:               withAlpha('--status-warn'),
                'warn-muted':       withAlpha('--status-warn-muted'),
                'warn-contrast':    withAlpha('--status-warn-contrast'),
                late:               withAlpha('--status-late'),
                'late-muted':       withAlpha('--status-late-muted'),
                'late-contrast':    withAlpha('--status-late-contrast'),
                pending:            withAlpha('--status-pending'),
                'pending-muted':    withAlpha('--status-pending-muted'),
                'pending-contrast': withAlpha('--status-pending-contrast'),
                info:               withAlpha('--status-info'),
                'info-muted':       withAlpha('--status-info-muted'),
                'info-contrast':    withAlpha('--status-info-contrast'),
            },
        },
    } },
    plugins: [],
}

export default config
