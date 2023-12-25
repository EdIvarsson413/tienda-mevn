import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import { useAuthStore } from '../stores/auth'
import requieresRole from '../js/requieresRole'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: InicioView,
      meta: { titulo: 'Inicio - Catalogo' }
    },
    {
      path: '/buscar/:nombre',
      name: 'buscar',
      component: () => import('../views/BuscarView.vue'),
      meta: { titulo: 'Resultados - ' }
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../views/RegistroView.vue'),
      meta: { titulo: 'Registrarse' }
    },
    {
      path: '/iniciar-sesion',
      name: 'iniciar-sesion',
      component: () => import('../views/IniciarSessionView.vue'),
      meta: { titulo: 'Iniciar Sesión' }
    },
    {
      path: '/confirmar/:token',
      name: 'registrarse',
      component: () => import('../views/ConfirmarView.vue'),
      meta: { titulo: 'Confirmar usuario' }
    },
    {
      path: '/admin/libros',
      name: 'admin',
      component: () => import('../views/AdministradorLibrosView.vue'),
      meta: { titulo: 'Administrador - Libros', requiresAdminRole : 'admin' },
    },
    {
      path: '/admin/promociones',
      name: 'promos',
      component: () => import('../views/AdministradorPromosView.vue'),
      meta: { titulo: 'Administrador - Promociones', requiresAdminRole : 'admin' },
    },
    {
      path: '/libro/:id',
      name: 'detalle-libro',
      component: () => import('../views/LibroView.vue'),
      meta: { titulo: 'Libro - ' },
    },
    {
      path: '/carrito',
      name: 'carrito',
      component: () => import('../views/CarritoView.vue'),
      meta: { titulo: 'Carrito', requiresUserRole: 'user' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: { titulo: 'Página no encontrada' }
    }
  ]
})

router.beforeEach( async (to, from, next) => {
  // Meter titulo a la pagina
  document.title = to.meta.titulo

  // Buscando campos meta
  const requiresAdminRole = to.matched.some( url => url.meta.requiresAdminRole );
  const requiresUserRole = to.matched.some( url => url.meta.requiresUserRole );
  const auth = useAuthStore()
  
  // Llamada al middleware
  await requieresRole( next, auth ,requiresAdminRole, requiresUserRole );
})

export default router
