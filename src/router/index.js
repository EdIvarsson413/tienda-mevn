import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import { useAuthStore } from '../stores/auth'
import { error } from '../js/Notificacion'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'incio',
      component: InicioView,
      meta: { title: 'Inicio - Catalogo' }
    },
    {
      path: '/buscar/:nombre',
      name: 'buscar',
      component: () => import('../views/BuscarView.vue'),
      meta: { title: 'Resultados - ' }
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../views/RegistroView.vue'),
      meta: { title: 'Registrarse' }
    },
    {
      path: '/iniciar-sesion',
      name: 'iniciar-sesion',
      component: () => import('../views/IniciarSessionView.vue'),
      meta: { title: 'Iniciar Sesión' }
    },
    {
      path: '/confirmar/:token',
      name: 'registrarse',
      component: () => import('../views/ConfirmarView.vue'),
      meta: { title: 'Confirmar usuario' }
    },
    {
      path: '/admin/libros',
      name: 'admin',
      component: () => import('../views/AdministradorLibrosView.vue'),
      meta: { title: 'Administrador - Libros', requiresAdminRole : 'admin' },
    },
    {
      path: '/admin/promociones',
      name: 'promos',
      component: () => import('../views/AdministradorPromosView.vue'),
      meta: { title: 'Administrador - Promociones', requiresAdminRole : 'admin' },
    },
    {
      path: '/libro/:id',
      name: 'detalle-libro',
      component: () => import('../views/LibroView.vue'),
      meta: { title: 'Libro - ' },
    },
  ]
})

router.beforeEach( async (to, from, next) => {
  // Meter titulo a la pagina
  document.title = to.meta.title

  // Buscando el otro campo meta
  const requiresAdminRole = to.matched.some( url => url.meta.requiresAdminRole );

  // Middleware para verificar rol del usuario
  const auth = useAuthStore()
  
  // Cuando el usuario entra al panel del admin
  if (requiresAdminRole) {
    const usuario = await auth.obtenerUsuario();
    
    // Verificando si hay un usuario y su rol es de administrador
    if (usuario && usuario.role === 'admin') {
      next();
    } else {
      // Si el usuario no es un administrador o no hay un usuario autenticado
      next({ name: 'iniciar-sesion' });
      error( 'Error :(', 'Acceso denegado, solo administradores' )
    }
  } else {
    // Se avanza al siguiente middleware si la ruta no esta protegida
    next();
  }
})

export default router
