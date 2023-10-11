const libro = ({
    _id: '',
    nombre: 'juego',
    saga: 'cancion',
    autor: 'jorge',
    precio: 500,
    sinopsis: 'asds',
    imagen: '',
    tipo: '',
    tokenPromo: ''
})

const validacionAgregar = (libro) => {
    // Excluye los campos 'tokenPromo' y '_id'
    const camposExcluidos = ['tokenPromo', '_id'];

    // Verifica si algún campo excluido está vacío o nulo
    // if (camposExcluidos.some((campo) => !libro[campo])) {
    //     return false;
    // }

    // Verifica que los otros campos no estén vacíos o nulos
    const camposObligatorios = ['nombre', 'saga', 'autor', 'sinopsis', 'imagen', 'tipo'];
    if (camposObligatorios.some((campo) => !libro[campo])) {
        return true;
    }

    // Verifica que el campo 'precio' sea mayor o igual a cero
    if( libro.precio.toString() === '' )
    return true;

    if (libro.precio <= 0) {
        return true;
    }

    // False = los campos no estan vacios
    return false;
}

const validacionEditar = (libro) => {
    // Excluye los campos 'tokenPromo', '_id' y 'imagen'
    const camposExcluidos = ['tokenPromo', '_id', 'imagen'];

    // Verifica si algún campo excluido está vacío o nulo
    // if (camposExcluidos.some((campo) => !libro[campo])) {
    //     return true;
    // }

    // Verifica que los otros campos no estén vacíos o nulos
    const camposObligatorios = ['nombre', 'saga', 'autor', 'sinopsis', 'tipo'];
    if (camposObligatorios.some((campo) => !libro[campo])) {
        return true;
    }

    // Verifica que el campo 'precio' sea mayor o igual a cero
    if( libro.precio.toString() === '' )
        return true;

    if (libro.precio <= 0) {
        return true;
    }

    // False = los campos no están vacíos
    return false;
};


// console.log('validacion editar',validacionEditar(libro))

export {
    validacionAgregar,
    validacionEditar
}