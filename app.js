const input = document.getElementById("inputTarea");
const btnAgregar = document.getElementById("btnAgregar");
const lista = document.getElementById("listaTareas");

let tareas = [];

//Funcion para renderizar tareas
function renderizarTareas(){
    lista.innerHTML = "";

    tareas.forEach((tarea, index) => {
        const li = document.createElement("li");
        li.textContent = tarea.texto;

        //boton borrar
        const btnBorrar = document.createElement("button");
        btnBorrar.textContent = "❌";
        btnBorrar.style.marginLeft = "10px";
        btnBorrar.onclick = () => borrarTarea(index);

        li.appendChild(btnBorrar);
        lista.appendChild(li);
    });
}

//funcion agregar tarea
function agregarTarea() {
    const texto = input.value.trim();

    if (texto === "") return;

    tareas.push({ texto });
    input.value = "";
    renderizarTareas();
    guardarEnLocalStorage();
}

btnAgregar.addEventListener("click", agregarTarea);

//funcion borrar tarea
function borrarTarea(index){
    tareas.splice(index,1);
    renderizarTareas();
    guardarEnLocalStorage();
}

// Local Storage
function guardarEnLocalStorage() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function cargarDesdeLocalStorage() {
    const data = localStorage.getItem("tareas");
    if (data) {
        tareas = JSON.parse(data);
        renderizarTareas();
    }
}

cargarDesdeLocalStorage();