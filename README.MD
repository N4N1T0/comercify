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

Una vez instalado, puedes importar las funciones de los diferentes módulos.
Por ejemplo, para usar una función del módulo `adrian`:

```typescript
import { myFunction } from 'comercify/adrian';

// Usa la función en tu proyecto
myFunction();
```

---

## 📚 Documentación de módulos

Aquí puedes encontrar la documentación específica de cada módulo/paquete aportado por los colaboradores:

- [adrian](./adrian/README.md)

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
