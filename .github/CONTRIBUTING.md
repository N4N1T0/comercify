# Cómo Contribuir a Comercify

¡Gracias por querer contribuir a Comercify! Personas como tú hacen que este proyecto sea un recurso valioso para la comunidad de e-commerce. Estamos emocionados por tus aportes.

## Pasos para añadir tu función utilitaria

Hemos simplificado el proceso para que puedas añadir fácilmente tus propias funciones utilitarias. Aquí tienes una guía paso a paso para comenzar:

### Paso 1: Haz un fork del repositorio

Si es tu primera vez contribuyendo, necesitas **[hacer un fork del repositorio](https://github.com/comercify-dev/comercify/fork)**. Esto crea una copia del proyecto en tu cuenta de GitHub donde puedes trabajar.

### Paso 2: Clona tu fork

Clona tu repositorio bifurcado a tu máquina local:

```bash
git clone https://github.com/TU_USUARIO/comercify.git
cd comercify
```

### Paso 3: Crea una nueva rama

Crea una rama nueva para tu contribución. Es recomendable que el nombre describa el cambio o la función que añades:

```bash
git checkout -b feat/add-mi-nueva-funcion
```

### Paso 4: Crea tu módulo

Dentro del directorio `src`, crea una carpeta con tu nombre de usuario de GitHub. Este será tu módulo personal donde añadirás tus funciones:

```bash
mkdir src/TU_USUARIO
```

### Paso 5: Añade tus funciones, tipos y tests

Dentro de tu módulo:

- Crea un archivo `index.ts` donde pondrás y exportarás tus funciones.

- Añade un archivo `types.ts` con los tipos o interfaces que uses.

- Crea un archivo `index.test.ts` con las pruebas unitarias usando `vitest`.

Ejemplo mínimo de `index.ts`:

```typescript
export const yourNewFunction = () => {
  // Tu lógica aquí
};
```

### Paso 6: Añade la documentación de tu módulo

Crea un archivo `README.md` dentro de tu módulo (`src/TU_USUARIO/README.md`) para documentar tus funciones. Luego, añade un enlace a esta documentación en la sección **Documentación de módulos** del README principal.

### Paso 7: Exporta tu módulo en `package.json`

Abre `package.json` y añade tu módulo al campo `exports`, para que otros puedan importarlo fácilmente:

```json
"exports": {
  "./adrian": "./dist/adrian/index.js",
  "./TU_USUARIO": "./dist/TU_USUARIO/index.js"
},
```

### Paso 8: Compila y prueba tus cambios

Ejecuta los comandos para compilar el paquete y correr los tests:

```bash
pnpm build
pnpm test
```

### Paso 9: Envía un Pull Request

Haz commit y push de tus cambios a tu fork, y abre un **pull request** hacia el repositorio principal:

```bash
git add .
git commit -m "feat: Añade nueva función útil"
git push origin feat/add-mi-nueva-funcion
```

Finalmente, abre tu PR en GitHub y lo revisaremos lo antes posible.

---

## Código de Conducta

Para mantener una comunidad inclusiva y amable, todos los colaboradores deben seguir nuestro [Código de Conducta](./CODE_OF_CONDUCT.md).

---

## Licencia

Al contribuir, aceptas que tu código será licenciado bajo la [Licencia MIT](./LICENSE) que rige el proyecto.
