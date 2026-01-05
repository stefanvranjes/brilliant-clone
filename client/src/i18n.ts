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
                "daily_challenge": "Daily Challenge",
                "learning_tracks": "Learning Tracks",
                "learning_tracks_subtitle": "Guided paths to master complex subjects."
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
                "daily_challenge": "Desafío Diario",
                "learning_tracks": "Rutas de Aprendizaje",
                "learning_tracks_subtitle": "Caminos guiados para dominar temas complejos."
            },
            "common": {
                "loading": "Cargando...",
                "no_results": "No se encontraron resultados."
            }
        }
    },
    fr: {
        translation: {
            "nav": {
                "explore": "Explorer",
                "progress": "Mon Progrès",
                "leaderboard": "Classement",
                "admin": "Admin",
                "logout": "Déconnexion",
                "login": "Connexion",
                "signup": "S'inscrire"
            },
            "home": {
                "hero_title": "Élevez votre esprit",
                "hero_subtitle": "Maîtrisez des concepts complexes grâce à des leçons interactives en mathématiques, logique et informatique.",
                "search_placeholder": "Rechercher des cours...",
                "view_progress": "Voir mon progrès",
                "daily_challenge": "Défi Quotidien",
                "learning_tracks": "Parcours d'Apprentissage",
                "learning_tracks_subtitle": "Des chemins guidés pour maîtriser des sujets complexes."
            },
            "common": {
                "loading": "Chargement...",
                "no_results": "Aucun résultat trouvé."
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
