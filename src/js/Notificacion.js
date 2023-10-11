// Se importa Sweet Alert para notificaciones
const swal = window.Swal;

// Plantilla del mensaje
const plantillaHTML = (titulo, mensaje) => `
    <style>
        .textColor {
            text-align: center;
            color: white;
        }
    </style>
    <h2 class="textColor">${titulo}</h2>
    <br>
    <h4 class="textColor">${mensaje}</h4>
`

// Modal de todo esta bien
const ok = (titulo, mensaje) => swal.fire({
    html: plantillaHTML(titulo, mensaje),
    icon: 'success',
    confirmButtonText: 'Aceptar',
});

// Modal de error
const error = (titulo, mensaje) => swal.fire({
    html: plantillaHTML(titulo, mensaje),
    icon: "error",
    confirmButtonText: 'Aceptar'
})

// Modal de algo ocurrio
const advertencia = (titulo, mensaje) => swal.fire({
    html: plantillaHTML(titulo, mensaje),
    icon: 'info',
    confirmButtonText: 'Aceptar',
})

// Modal de confirmacion - retorna un booleano
const confirmar = (titulo, mensaje, buttonText) => swal.fire({
    html: plantillaHTML(titulo, mensaje),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: buttonText,
    showCancelButton: "Cancelar"
}).then(resultado => {
    if( resultado.value ) return resultado.value;
    else {return false};
})

// Modal para ingresar un valor
const escribirInput = (titulo,mensaje) => swal.fire({
    html: plantillaHTML(titulo, mensaje),
    icon: "info",
    input: "number",
    showCancelButton: true,
    confirmButtonText: "Editar",
    cancelButtonText: "Cancelar",
    inputValidator: v => {
        if(!v) return "Debes escribir nuevas unidades";
    }
}).then(resultado => {
    if(parseInt(resultado.value) > 0) return parseInt(resultado.value);
})

export {
    ok,
    advertencia,
    confirmar,
    escribirInput,
    error
}