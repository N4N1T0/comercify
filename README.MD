# 🛒 Comercify

> **E-commerce utility functions by the community, for the community.**

[![npm version](https://img.shields.io/npm/v/comercify.svg)](https://www.npmjs.com/package/comercify)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](../LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/comercify-dev/comercify/ci.yml?branch=main)](https://github.com/comercify-dev/comercify/actions)
[![Contributors](https://img.shields.io/github/contributors/comercify-dev/comercify)](https://github.com/comercify-dev/comercify/graphs/contributors)

---

## 📖 ¿Qué es Comercify?

**Comercify** es un proyecto **open source** impulsado por la comunidad que ofrece una **colección de funciones de utilidad para el desarrollo de e-commerce**.  
El objetivo es crear una librería compartida de funciones reutilizables que simplifiquen tareas comunes al construir aplicaciones de comercio electrónico.

Cada colaborador puede añadir **su propio módulo** con funciones específicas, que luego se pueden importar fácilmente desde el paquete principal.

---

## 🚀 Instalación

Instala Comercify con tu gestor de paquetes favorito:

```bash
pnpm add comercify
# o
npm install comercify
# o
yarn add comercify
```

---

## ⚡ Uso

Una vez instalado, puedes importar las funciones de los diferentes módulos de dos formas:

### Importación por módulo individual

```typescript
import { eurilize, slugify } from 'comercify/adrian';

// Usa las funciones en tu proyecto
const price = eurilize(1234.56); // "1.234,56 €"
const slug = slugify('Producto Nuevo'); // "producto-nuevo"
```

### Importación consolidada (recomendado)

Genera un archivo consolidado con todas las exportaciones:

```bash
# Genera ./src/lib/comercify.ts con todas las exportaciones
npx comercify-cli

# O especifica una ruta personalizada
npx comercify-cli --output ./src/utils.ts
```

Luego importa desde el archivo local:

```typescript
import { eurilize, slugify, calculateSavings } from './lib/comercify';

// Todas las funciones disponibles desde un solo archivo
const price = eurilize(1234.56);
const slug = slugify('Producto Nuevo');
const savings = calculateSavings(100, 80);
```

---

## 🛠️ CLI Tool

Comercify incluye una herramienta de línea de comandos para copiar archivos de módulos de usuario dentro de tu proyecto.

### Propósito

La herramienta CLI escanea las carpetas de usuario en el directorio `src/`, te permite seleccionar una de forma interactiva, y copia su archivo `index.ts` a una ubicación especificada. Esto es útil para duplicar estructuras de módulos o crear nuevos módulos basados en existentes.

### Uso del CLI

```bash
# Ejecutar el CLI interactivo
pnpm run cli
```

**Proceso Interactivo:**

1. Muestra las carpetas de usuario disponibles con su estado
2. Te permite seleccionar una carpeta por número
3. Solicita la ruta de salida (por defecto: `./src/lib/comercify.ts`)
4. Copia el archivo `index.ts` de la carpeta seleccionada

**Ejemplo de Salida:**

```ts
📁 Carpetas de usuario disponibles:
  1. adrian ✅ (tiene index.ts)
  2. utils ❌ (sin index.ts)

🔢 Selecciona un número de carpeta: 1
📝 Ingresa la ruta de salida (por defecto: ./src/lib/comercify.ts):
✅ ¡Archivo copiado exitosamente!
```

### Casos de Uso

- **Plantillas de Módulos**: Copiar módulos existentes como punto de partida para nuevas funcionalidades
- **Respaldo de Código**: Crear respaldos de módulos importantes
- **Duplicación de Estructura**: Mantener patrones consistentes entre módulos
- **Prototipado Rápido**: Crear rápidamente nuevos módulos basados en estructuras probadas

### Beneficios

- **Selección Interactiva**: Proceso amigable de selección de carpetas
- **Seguimiento de Origen**: Comentarios de encabezado muestran la fuente original y timestamp
- **Salida Flexible**: Elige cualquier ruta de destino
- **Preserva Estructura**: Mantiene la organización y comentarios del archivo original

Para más detalles, consulta la [documentación del CLI](src/cli/README.md).

---

## 📚 Documentación de módulos

Aquí puedes encontrar la documentación específica de cada módulo/paquete aportado por los colaboradores:

- [adrian](src/adrian/README.md)

---

## 🙌 Cómo Contribuir

¡Todas las contribuciones son bienvenidas!
Si tienes una función de utilidad que pueda ayudar a la comunidad, aquí tienes los pasos para añadirla:

1. **Haz un fork del repositorio** y crea una nueva rama para tu feature.

2. **Crea un nuevo módulo**: Dentro de `src`, crea una carpeta con tu nombre de usuario de GitHub (ej: `src/tu-usuario`).

3. **Añade tus funciones** en `index.ts` y expórtalas:

   ```typescript
   // src/tu-usuario/index.ts
   export const yourNewFunction = () => {
     // Tu lógica aquí
   };
   ```

4. **Añade los tipos** de tu módulo en `types.ts`:

   ```typescript
   export interface YourNewFunctionParams {
     // Define tus parámetros aquí
   }
   ```

5. **Añade la prueba** de tu módulo en `index.test.ts`:

   ```typescript
   import { yourNewFunction } from './index';
   import { YourNewFunctionParams } from './types';
   ```

6. **Añade la documentación** de tu módulo en `src/tu-usuario/README.md` y en el apartado de **Documentación de módulos** del README Principal añade el link.

7. **Exporta tu módulo** en el `package.json`:

   ```json
   "exports": {
     "./adrian": "./dist/adrian/index.js",
     "./tu-usuario": "./dist/tu-usuario/index.js"
   },
   ```

8. **Compila y prueba** tus cambios:

   ```bash
   pnpm build
   pnpm test
   ```

9. **Envía un Pull Request** con tus cambios.
   Revisa nuestra guía de [Contribución](../CONTRIBUTING.md) para más detalles.

---

## 📝 Licencia

Este proyecto está bajo la **Licencia MIT**.
Consulta el archivo [LICENSE](../LICENSE) para más información.
