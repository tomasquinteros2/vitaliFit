# 💪 VitaliFit — Suplementación Deportiva de Élite

> **"Desata tu potencial. Suplementación deportiva de élite para atletas que no aceptan límites."**

VitaliFit es una tienda online de suplementos deportivos construida con **Next.js 14**, **TypeScript**, **Tailwind CSS** y **Firebase**. Cuenta con un panel de administración para gestionar productos y promociones en tiempo real.

---

## 🚀 Demo

> [https://github.com/tomasquinteros2/vitaliFit](https://github.com/tomasquinteros2/vitaliFit)

---


## 🛠️ Tecnologías

| Tecnología | Descripción |
|---|---|
| [Next.js 14](https://nextjs.org/) | Framework de React con App Router |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos utilitarios |
| [Firebase](https://firebase.google.com/) | Base de datos en tiempo real (Firestore) + Auth |
| [Lucide React](https://lucide.dev/) | Iconografía |

---

## 📦 Categorías de productos

- 🥛 **Proteínas** — Whey, caseína, proteína vegana y más
- ⚡ **Pre-Workout** — Energía y foco antes del entrenamiento
- 🔄 **Recuperación** — Creatina, aminoácidos y recuperadores musculares
- 💊 **Salud & Vitaminas** — Vitaminas, minerales y suplementos de bienestar

---

## ✨ Funcionalidades

- 🛍️ **Catálogo de productos** con filtros por categoría, búsqueda y precio
- 🛒 **Carrito de compras** con drawer lateral
- 🔍 **Buscador** con scroll automático a resultados
- 🏷️ **Sección de ofertas/promociones** con imágenes y descuentos
- 🔐 **Panel de administración** protegido para gestionar productos y promos
- 📱 **Diseño responsive** optimizado para mobile y desktop
- 🔔 **Notificación al agregar al carrito** (sin abrir el drawer automáticamente en mobile)

---

## 🗂️ Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx              # Página principal (Home)
│   ├── layout.tsx            # Layout global
│   ├── globals.css           # Estilos globales
│   ├── admin/                # Panel de administración
│   ├── category/[slug]/      # Página de categoría dinámica
│   └── promos/               # Página de promociones
├── components/
│   ├── Navbar.tsx            # Barra de navegación
│   ├── CartDrawer.tsx        # Carrito lateral
│   └── ProductCard.tsx       # Card de producto
├── context/
│   ├── AuthContext.tsx       # Contexto de autenticación
│   ├── CartContext.tsx       # Contexto del carrito
│   ├── ProductContext.tsx    # Contexto de productos
│   └── PromoContext.tsx      # Contexto de promociones
├── lib/
│   └── firebase.ts           # Configuración de Firebase
└── types/
    └── index.ts              # Tipos TypeScript globales
```

---

## ⚙️ Instalación y uso local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tomasquinteros2/vitaliFit.git
cd vitaliFit
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Build para producción

```bash
npm run build
npm start
```

---

## 🔐 Panel de Administración

Accesible en `/admin`. Permite:
- Agregar, editar y eliminar productos
- Gestionar categorías (Proteínas, Pre-Workout, Recuperación, Salud & Vitaminas)
- Crear y administrar promociones

El acceso está protegido mediante **Firebase Authentication**.

---

## 📁 .gitignore recomendado

Asegurate de tener las siguientes entradas en tu `.gitignore`:

```
.env.local
.env*.local
node_modules/
.next/
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abrí un issue antes de hacer un pull request para discutir los cambios propuestos.

---

## 📄 Licencia

Este proyecto es de uso privado. Todos los derechos reservados © 2026 VitaliFit.

---

<div align="center">
  Hecho con 💪 y mucha proteína por <strong>Tomás Quinteros</strong>
</div>
