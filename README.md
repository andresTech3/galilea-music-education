# Galilea Music Education 🎵

> Instituto de música profesional con clases de Piano, Guitarra y Batería.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=three.js)](https://threejs.org)

## 🚀 Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript
- **3D / Animaciones:** Three.js + @react-three/fiber + Framer Motion
- **Base de datos:** Supabase (PostgreSQL + RLS)
- **Estilos:** Vanilla CSS Design System (Negro #111 + Fucsia #FF00AA)
- **Deploy:** Vercel (listo)

## 📄 Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Homepage con Hero 3D |
| `/cursos/piano` | Clases de Piano — Andrés Narváez |
| `/cursos/guitarra` | Clases de Guitarra — Danco Padilla |
| `/cursos/bateria` | Clases de Batería — José Ricardo |
| `/nosotros` | Equipo y misión |
| `/inscribirse` | Formulario de inscripción |
| `/galeria` | Galería de imágenes |

## 🛠️ Setup local

```bash
# 1. Clonar el repositorio
git clone https://github.com/andresTech3/galilea-music-education.git
cd galilea-music-education

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 4. Correr en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## ⚙️ Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🎓 Información del Instituto

- **Nombre:** Galilea Music Education
- **Dirección:** Barrio Piñalito
- **Horarios:** Lunes y Miércoles (9am–11am, 3pm–6pm)
- **Precio:** $40.000 COP / mes

## 📦 Despliegue en Vercel

```bash
npm install -g vercel
vercel
```

---

Hecho con ♪ para la música