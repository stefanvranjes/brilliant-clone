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
            "dashboard": {
                "title": "Your Progress",
                "subtitle": "Keep up the momentum!",
                "total_xp": "Total XP",
                "current_level": "Current Level",
                "day_streak": "Day Streak",
                "problems_solved": "Problems Solved",
                "weekly_activity": "Weekly Activity",
                "last_7_days": "Last 7 Days",
                "ai_coach": "AI Coach",
                "achievements": "Achievements",
                "achievements_subtitle": "Badges you've earned on your journey."
            },
            "problem": {
                "submit": "Submit Answer",
                "next": "Next Problem",
                "hint": "Need a hint?",
                "explanation": "Explanation",
                "correct": "Correct!",
                "incorrect": "Not quite right. Try again!"
            },
            "onboarding": {
                "title": "Let's find your baseline",
                "subtitle": "Solve these problems to help us personalize your learning path.",
                "preparing": "Preparing your assessment...",
                "diagnosing": "Expert AI is analyzing your results...",
                "complete": "Assessment Complete!",
                "start_learning": "Start Learning",
                "accuracy": "Overall Accuracy",
                "breakdown": "Skill Breakdown",
                "problem_count": "Problem {{current}} of {{total}}",
                "percent_complete": "{{percent}}% Complete"
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
            "dashboard": {
                "title": "Tu Progreso",
                "subtitle": "¡Sigue así!",
                "total_xp": "XP Total",
                "current_level": "Nivel Actual",
                "day_streak": "Racha de Días",
                "problems_solved": "Problemas Resueltos",
                "weekly_activity": "Actividad Semanal",
                "last_7_days": "Últimos 7 días",
                "ai_coach": "Entrenador AI",
                "achievements": "Logros",
                "achievements_subtitle": "Insignias que has ganado en tu viaje."
            },
            "problem": {
                "submit": "Enviar Respuesta",
                "next": "Siguiente Problema",
                "hint": "¿Necesitas una pista?",
                "explanation": "Explicación",
                "correct": "¡Correcto!",
                "incorrect": "No del todo. ¡Inténtalo de nuevo!"
            },
            "onboarding": {
                "title": "Encontremos tu nivel",
                "subtitle": "Resuelve estos problemas para ayudarnos a personalizar tu camino de aprendizaje.",
                "preparing": "Preparando tu evaluación...",
                "diagnosing": "La IA experta está analizando tus resultados...",
                "complete": "¡Evaluación completada!",
                "start_learning": "Empezar a aprender",
                "accuracy": "Precisión general",
                "breakdown": "Desglose de habilidades",
                "problem_count": "Problema {{current}} de {{total}}",
                "percent_complete": "{{percent}}% completado"
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
            "dashboard": {
                "title": "Votre Progrès",
                "subtitle": "Continuez comme ça !",
                "total_xp": "XP Total",
                "current_level": "Niveau Actuel",
                "day_streak": "Série de Jours",
                "problems_solved": "Problèmes Résolus",
                "weekly_activity": "Activité Hebdomadaire",
                "last_7_days": "7 derniers jours",
                "ai_coach": "Coach IA",
                "achievements": "Succès",
                "achievements_subtitle": "Badges que vous avez gagnés au cours de votre voyage."
            },
            "problem": {
                "submit": "Soumettre la Réponse",
                "next": "Problème Suivant",
                "hint": "Besoin d'un indice ?",
                "explanation": "Explication",
                "correct": "Correct !",
                "incorrect": "Pas tout à fait. Réessayez !"
            },
            "onboarding": {
                "title": "Trouvons votre niveau",
                "subtitle": "Résolvez ces problèmes pour nous aider à personnaliser votre parcours d'apprentissage.",
                "preparing": "Préparation de votre évaluation...",
                "diagnosing": "L'IA experte analyse vos résultats...",
                "complete": "Évaluation terminée !",
                "start_learning": "Commencer à apprendre",
                "accuracy": "Précision globale",
                "breakdown": "Répartition des compétences",
                "problem_count": "Problème {{current}} sur {{total}}",
                "percent_complete": "{{percent}}% terminé"
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
