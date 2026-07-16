# 🎭 QA Automation con Playwright — Laboratorio 01

> Automatización de pruebas End-to-End sobre [Demoblaze](https://www.demoblaze.com) usando **Playwright + TypeScript**.

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Tests](https://img.shields.io/badge/tests-3%20passed-brightgreen?style=for-the-badge)

---

## 👤 Datos del estudiante

| Campo | Detalle |
|---|---|
| **Nombre** | Amner Alberto Pérez Marroquín |
| **Carné** | 1790-227230 |
| **Laboratorio** | 01 — Primer test con Playwright |
| **Sitio bajo prueba (SUT)** | https://www.demoblaze.com |

---

## 🛠️ Entorno de desarrollo

| Herramienta | Versión |
|---|---|
| **Node.js** | v25.9.0 |
| **npm** | 11.12.1 |
| **Git** | 2.51.0 |
| **Visual Studio Code** | 1.121.0 |
| **Extensión** | Playwright Test for VSCode (`ms-playwright.playwright`) |
| **Sistema operativo** | Windows 11 |

---

## 📁 Estructura del proyecto

```
qa-playwright-curso/
├── docs/
│   └── tests-passing.png       # Evidencia: los 3 tests pasando
├── tests/
│   └── clase01.spec.ts         # Suite de pruebas del laboratorio
├── .gitignore                  # Excluye node_modules, reportes y artefactos
├── .npmrc                      # Seguridad: ignore-scripts=true
├── package.json                # Dependencias del proyecto
├── playwright.config.ts        # Configuración de Playwright
├── tsconfig.json               # Configuración de TypeScript
└── README.md                   # Este archivo
```

---

## ⚙️ Configuración aplicada

### `playwright.config.ts`

| Opción | Valor | Para qué sirve |
|---|---|---|
| `testDir` | `./tests` | Carpeta donde Playwright busca los tests |
| `timeout` | `30000` | Máximo 30 s por test antes de fallar |
| `reporter` | `list` + `html` | Salida en consola y reporte visual navegable |
| `baseURL` | `https://www.demoblaze.com` | Permite navegar con `page.goto('/')` |
| `headless` | `false` | Muestra el navegador durante la ejecución |
| `screenshot` | `only-on-failure` | Captura automática solo si un test falla |
| `video` | `retain-on-failure` | Graba video solo de los tests que fallan |
| `projects` | `chromium` (Desktop Chrome) | Navegador objetivo de la suite |

### `tsconfig.json`

Compilación en **ES2020** con `strict: true` activado, para detectar errores de tipos antes de ejecutar.

---

## 🔒 Nota de seguridad: bloqueo de scripts de instalación

Al correr `npm install`, los paquetes pueden ejecutar scripts automáticos (`postinstall`). Esto es un **vector de ataque de cadena de suministro**: una dependencia comprometida podría ejecutar código en la máquina sin aprobación del desarrollador.

**Protección aplicada** — el archivo `.npmrc` contiene:

```
ignore-scripts=true
```

**Consecuencia intencional:** la descarga de navegadores deja de ser automática y se lanza de forma explícita y consciente:

```bash
npx playwright install
```

---

## 🧪 Tests implementados

Archivo: **`tests/clase01.spec.ts`** — 3 verificaciones sobre la carga de la página principal.

### 1️⃣ La página carga
Valida que el sitio responde y renderiza su estructura base.
- El título de la página contiene `STORE` → `expect(page).toHaveTitle(/STORE/)`
- La barra de navegación `#navbarExample` es visible

### 2️⃣ El menú de categorías es visible
Valida que el componente de categorías del sidebar se renderiza.
- El elemento `#cat` es visible

### 3️⃣ La barra de navegación tiene los enlaces
Valida la navegación principal usando un locator con rol semántico.
- Dentro de `#navbarExample` existe y es visible el enlace `Home`

> 💡 Los tres tests usan `page.goto('/')` en lugar de la URL completa, aprovechando el `baseURL` definido en la configuración.

---

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos
- Node.js **v18 o superior**
- Git

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/PerezAmnerJr/qa-playwright-curso.git
cd qa-playwright-curso

# 2. Instalar dependencias
npm install

# 3. Instalar los navegadores (manual, por ignore-scripts=true)
npx playwright install
```

### Ejecución

```bash
# Ejecutar todos los tests
npx playwright test

# Ver el reporte HTML (se abre en http://localhost:9323)
npx playwright show-report

# Modo visual interactivo (los tests se lanzan con clic)
npx playwright test --ui
```

---

## ✅ Resultados

**3 de 3 tests aprobados** — 0 fallidos, 0 flaky, 0 omitidos.

![Los 3 tests pasando correctamente](docs/tests-passing.png)

| Test | Estado | Duración |
|---|---|---|
| La página carga | ✅ Passed | 2.2 s |
| El menú de categorías es visible | ✅ Passed | 1.5 s |
| La barra de navegación tiene los enlaces | ✅ Passed | 1.8 s |
| **Total** | **✅ 3 passed** | **7.8 s** |

---

## 📚 Aprendizajes de la clase

- Configurar un proyecto de Playwright desde cero con TypeScript.
- Usar `baseURL` para escribir tests más limpios y mantenibles.
- Diferenciar `headless: false` (desarrollo, ver el navegador) de `headless: true` (CI/CD).
- Aplicar `ignore-scripts=true` como medida contra ataques de cadena de suministro.
- Localizar elementos por **ID** (`#navbarExample`, `#cat`) y por **rol semántico** (`getByRole('link', { name: 'Home' })`).
- Interpretar el reporte HTML: passed, failed, flaky y tiempos de ejecución.

---

## 🔜 Próxima clase

**Clase 2** — Navegación, esperas y capturas.

---

<div align="center">

**Amner Alberto Pérez Marroquín** · Carné 1790-227230

</div>