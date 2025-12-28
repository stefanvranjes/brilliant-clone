import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "nav": {
                "explore": "Explore",
                "progress": "My Progress",
                "leaderboard": "Leaderboard",
                "admin": "Admin",
                "logout": "Logout",
                "login": "Log in",
                "signup": "Sign up"
            },
            "home": {
                "hero_title": "Level up your mind",
                "hero_subtitle": "Master complex concepts through interactive, bite-sized lessons in math, logic, and computer science.",
                "search_placeholder": "Search courses by topic, title, or category...",
                "view_progress": "View My Progress",
                "daily_challenge": "Daily Challenge"
            },
            "common": {
                "loading": "Loading...",
                "no_results": "No results found."
            }
        }
    },
    es: {
        translation: {
            "nav": {
                "explore": "Explorar",
                "progress": "Mi Progreso",
                "leaderboard": "Clasificación",
                "admin": "Admin",
                "logout": "Cerrar Sesión",
                "login": "Iniciar sesión",
                "signup": "Registrarse"
            },
            "home": {
                "hero_title": "Mejora tu mente",
                "hero_subtitle": "Domina conceptos complejos mediante lecciones interactivas y breves de matemáticas, lógica e informática.",
                "search_placeholder": "Buscar cursos por tema, título o categoría...",
                "view_progress": "Ver Mi Progreso",
                "daily_challenge": "Desafío Diario"
            },
            "common": {
                "loading": "Cargando...",
                "no_results": "No se encontraron resultados."
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
