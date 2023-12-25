import { error } from '../js/Notificacion'

// Middleware para proteger las vistas de carrito y administrador
export default async ( next, auth, admin, user ) => {
    // Cuando se entra a la pagina del admin
    if( admin ) {
        const usuario = await auth.obtenerUsuario();
        
        if( usuario && usuario.role === 'admin' ) {
            next()
        }
        else {
            // Si el usuario no es un administrador
            next({ name: 'iniciar-sesion' });
            error( 'Error :(', 'Acceso denegado, solo administradores' )
        }

        // Cuando se entra a la pagina del carrito 
    } else if( user ) {
        const usuario = await auth.obtenerUsuario();
        
        if( usuario && usuario.role === 'user' ) {
            next()
        }
        else {
            // Si el usuario no es un usuario normal
            next({ name: 'iniciar-sesion' });
            error( 'Error :(', 'Acceso denegado, solo clientes' )
        }
    }
    else {
        // Se avanza al siguiente middleware si la ruta no esta protegida
        next();
    }
}