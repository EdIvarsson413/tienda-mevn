# Sobre el proyecto

Este proyecto es una refactor, una nueva versión del proyecto de la tienda virtual con la pila MEVN Este es el proyecto de la materia de Pila Completa I con MEVN (MongoDB, ExpressJs, VueJs y NodeJs).

Como dependencias secundarias se usan :
#### Firebase
- Uso del servicio de almacenamiento para imagenes

#### Vuetify
- Alternativa a usar CSS puro

#### Pinia
- Para estados globales

## Cambios y planeaciones: 
+ Mejoras en la UI
    - Buscar la mejor solución para reducuir la cantidad de clases o props de Vuetify.
    - Componentizar elementos que requieren más de 10 lineas de código.
+ Reducuir código
    - Ligado a las mejoras de UI, se busca un modo de reducir código con componentes o archivos externos que realizane operaciones auxiliares. Pinia para tener operaciones de con los estados y evitar redudancia, propiedades computadas para mejor gestión de cambios y limpieza en el HTML.
+ Aplicar mejores practicas
    - Con mejores conociemientos sobre el framework, se hace un mejor empleo de directivas, metodos y reactividad tanto en el HTML como en los scripts.


## Vue 3 + Vite

Este proyeto es una app con Vue Router para mejorar las vistas sobre el sitio web. Utilizando las ultimas versiones de Vite & Vue.

### Configuración del IDE

Recomendaciones:
- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).