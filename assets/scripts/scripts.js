let Usuario_Logueado = {};

function fInicio() {
    // Aquí hacer el Login otra vez
    fMostrarForm("#div_login")
}

function fMostrarForm(nombre_de_cual_con_almohadilla) {
    // Ocultar todos los formularios
    let listaformularios = document.querySelectorAll("#div_modal > div");
    listaformularios.forEach(item => {
        item.style.display = 'none';

    });
    // Muestro el que me piden
    document.querySelector(nombre_de_cual_con_almohadilla).style.display = 'flex';
    // Mostrar la modal
    document.querySelector('#div_modal').style.display = 'flex';
}

function fOcultarForm() {
    document.querySelector('#div_modal').style.display = 'none';
}

function fCerrarSesion() {
    Usuario_Logueado = {};
    document.querySelector("#login_nombre").value = '';
    document.querySelector("#login_password").value = '';
    fMostrarForm("#div_login");
}

function fAbrirLogin() {
    fMostrarForm("#div_login")
}

function fAbrirRegistro() {
    fMostrarForm("#div_registro")
}
function fInvitado() {
    document.querySelector('#div_modal').style.display = 'none';
    Usuario_Logueado.usu_admin = 0;
    Usuario_Logueado.usu_user = "i";
    document.querySelector("#div_cerrar").style.display = 'none';
    fMostrarTemas();
}

function fLogin() {
    let nombre = document.querySelector("#login_nombre").value;
    let password = document.querySelector("#login_password").value;

    let sql = "call Buscar_Usuario('" + nombre + "', '" + password + "')";
    console.log(sql)
    let URL = "assets/php/servidor.php?peticion=EjecutarSelect&sql=" + sql;

    fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            
            if (data.datos.length == 0) {
                document.querySelector("#div_error").innerHTML = "Incorrecto, pruebe otra vez";
                return;
            } else {
                Usuario_Logueado = data.datos[0];
                console.log("Usuario Logueado ", Usuario_Logueado)
                fOcultarForm();
                fMostrarTemas();
            }
        })
    
}

function fRegistrar() {
    let nombre = document.querySelector("#registro_nombre").value;
    let password = document.querySelector("#registro_password").value;
    let rpassword = document.querySelector("#registro_rpassword").value;

    let sql = "call Insertar_Usuario('" + nombre + "', '" + password + "')"

    // AquÃ­ los password no coinciden
    if (password != rpassword) {
        document.querySelector("#div_error_registro").innerHTML = "Las contraseñas no coinciden"
        return;
    }

    // A partir de aquÃ­ los password coinciden
    let URL = "assets/php/servidor.php?peticion=EjecutarInsert&sql=" + sql;

    fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })

    fAbrirLogin();
}

// TEMAS

function fMostrarTemas() {
    let titulo = "<h1>TEMAS"
    if (Usuario_Logueado.usu_admin == 1) {
    titulo += `<span onclick="fPreparaFormTemas('a', 0, '')" class="acciones">`;
    titulo += `    <i class="fas fa-plus" title="Añadir tema"></i>`;
    titulo += `</span>`;
    }
    titulo += "</h1>";
    document.querySelector("#section_titulo_tema").innerHTML = titulo;

    let sql = "SELECT * FROM temas";
    let URL = "assets/php/servidor.php?peticion=EjecutarSelect&sql=" + sql;
    fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let html = '';
            data.datos.forEach(item => {
                html += `<div class="div_contenedor_tema">`;
                html += `<div class="div_tema" onclick="fMostrarMensajes(${item.tem_id})">${item.tem_nombre}</div>`
                if (Usuario_Logueado.usu_admin == 1) {
                html += "<div class='div_acciones'>"
                html += `<span onclick="fPreparaFormTemas('b', ${item.tem_id}, '${item.tem_nombre}')" class='acciones'>`
                html += `<i class="fas fa-trash" title="Borrar tema"></i>`
                html += `</span>`
                html += `<span onclick="fPreparaFormTemas('m', ${item.tem_id}, '${item.tem_nombre}')" class='acciones'>`
                html += `<i class="fas fa-edit" title="Modificar tema"></i>`
                html += `</span>`
                html += "</div>"
                }
                html += `</div>`;
            });
            document.querySelector("#section_temas").innerHTML = html;
        })

}

function fPreparaFormTemas(para_que, id, nombre) {
    document.querySelector("#tem_id").value = id;
    document.querySelector("#tem_nombre").value = nombre;

    // Analizar para_que
    if (para_que == 'a') {
        document.querySelector("#tem_A").style.display = 'block';
        document.querySelector("#tem_M").style.display = 'none';
        document.querySelector("#tem_B").style.display = 'none';
    }
    if (para_que == 'b') {
        document.querySelector("#tem_A").style.display = 'none';
        document.querySelector("#tem_M").style.display = 'none';
        document.querySelector("#tem_B").style.display = 'block';
    }
    if (para_que == 'm') {
        document.querySelector("#tem_A").style.display = 'none';
        document.querySelector("#tem_M").style.display = 'block';
        document.querySelector("#tem_B").style.display = 'none';
    }

    fMostrarForm("#div_temas");
}

function fCRUDTemas(operacion) {
    let sql = ``;
    let id = document.querySelector("#tem_id").value;
    let nombre = document.querySelector("#tem_nombre").value;

    // VALIDAR CAMPOS
    if (operacion == 'a') {
        sql = `Insert into temas values (null, '${nombre}')`;
    }
    if (operacion == 'm') {
        sql = `Update temas set tem_nombre = '${nombre}' where tem_id = '${id}'`;
    }
    if (operacion == 'b') {
        sql = `Delete from temas where tem_id = ${id}`;

    }
    // Enviar el sql al servidor
    let URL = "assets/php/servidor.php?";
    if (operacion == 'a') {
        URL += "peticion=EjecutarInsert";
    } else {
        URL += "peticion=EjecutarUpdateDelete";
    }
    URL += "&sql=" + sql;
    fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            console.log("CRUD temas", data);

        })
        .finally(() => {
            fOcultarForm();
            fMostrarTemas();
        });
}

function fMostrarMensajes(id_tema) {
    let titulo = "<h1>MENSAJES"
    if (Usuario_Logueado.usu_user != "i") {
    titulo += `<span onclick="fPreparaFormMensajes('a', 0, '', '', 0, ${id_tema})" class="acciones">`;
    titulo += `    <i class="fas fa-plus" title="Añadir mensaje"></i>`;
    titulo += `</span>`;
    }
    titulo += "</h1>";
    document.querySelector("#section_titulo_mensaje").innerHTML = titulo;

    let sql = `SELECT * FROM mensajes, usuarios, fotos where usu_foto_id = foto_id and men_usu_id = usu_id and men_tem_id = '${id_tema}'`;
    let URL = "assets/php/servidor.php?peticion=EjecutarSelect&sql=" + sql;
    fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let html = '';
            data.datos.forEach(item => {
                html += `<div class="div_contenedor_mensaje">`;
                html += `<div class="div_persona">`
                html += `<div class="div_foto">`
                html += `<img src='assets/imagenes/${item.foto_nombre}' alt='Foto'>`
                html += `</div>`
                html += `<div class="div_user">${item.usu_user}</div>`
                html += `</div>`
                html += `<div class="div_mensaje">`
                html += `<div class="div_texto">${item.men_texto}</div>`
                html += `<div class="div_hora">${item.men_fecha}</div>`
                html += `</div>`
                if (Usuario_Logueado.usu_admin == 1 || Usuario_Logueado.usu_user == item.usu_user ) {
                html += "<div class='div_acciones'>"
                html += `<span onclick="fPreparaFormMensajes('b', ${item.men_id}, '${item.men_texto}', '${item.men_fecha}', '${item.men_usu_id}', '${id_tema}')" class='acciones'>`
                html += `<i class="fas fa-trash" title="Borrar mensaje"></i>`
                html += `</span>`
                html += `<span onclick="fPreparaFormMensajes('m', ${item.men_id}, '${item.men_texto}', '${item.men_fecha}', '${item.men_usu_id}', '${id_tema}')" class='acciones'>`
                html += `<i class="fas fa-edit" title="Modificar tema"></i>`
                html += `</span>`
                html += "</div>"
                }
                html += `</div>`;
            });
            document.querySelector("#section_mensajes").innerHTML = html;
        })
}

function fPreparaFormMensajes(para_que, id, texto, fecha, usu_id, id_tema) {
    document.querySelector("#men_id").value = id;
    document.querySelector("#men_texto").value = texto;
    document.querySelector("#men_fecha").value = fecha;
    document.querySelector("#men_usu_id").value = usu_id;
    document.querySelector("#men_tem_id").value = id_tema;

    // Analizar para_que
    if (para_que == 'a') {
        document.querySelector("#men_A").style.display = 'block';
        document.querySelector("#men_M").style.display = 'none';
        document.querySelector("#men_B").style.display = 'none';
    }
    if (para_que == 'b') {
        document.querySelector("#men_A").style.display = 'none';
        document.querySelector("#men_M").style.display = 'none';
        document.querySelector("#men_B").style.display = 'block';
    }
    if (para_que == 'm') {
        document.querySelector("#men_A").style.display = 'none';
        document.querySelector("#men_M").style.display = 'block';
        document.querySelector("#men_B").style.display = 'none';
    }

    fMostrarForm("#div_mensajes");
}

function fCRUDMensajes(operacion) {
    let sql = ``;
    let id = document.querySelector("#men_id").value;
    let texto = document.querySelector("#men_texto").value;
    let fecha = document.querySelector("#men_fecha").value;
    let usu_id = document.querySelector("#men_usu_id").value;
    let id_tema = document.querySelector("#men_tem_id").value;

    // VALIDAR CAMPOS
    if (operacion == 'a') {
        sql = `CALL Insertar_Mensajes('${texto}', '${Usuario_Logueado.usu_id}', '${id_tema}')`;
    }
    if (operacion == 'm') {
        sql = `Update mensajes set men_texto = '${texto}' where men_id = '${id}'`;
    }
    if (operacion == 'b') {
        sql = `Delete from mensajes where men_id = ${id}`;

    }
    // Enviar el sql al servidor
    let URL = "assets/php/servidor.php?";
    if (operacion == 'a') {
        URL += "peticion=EjecutarInsert";
    } else {
        URL += "peticion=EjecutarUpdateDelete";
    }
    URL += "&sql=" + sql;
    fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            console.log("CRUD mensajes", data);

        })
        .finally(() => {
            fOcultarForm();
            fMostrarMensajes(id_tema);
        });
}