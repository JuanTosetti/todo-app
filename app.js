let filtroActual = "todas"; // "todas" | "pendientes" | "completadas"
let ultimoId = 0; //variable global, contador de IDs
const input = document.getElementById("inputTarea");
const lista = document.getElementById("listaTareas");
const form = document.getElementById("formTarea");

let tareas = [];

/*RENDERIZAR TAREAS*/
function renderizarTareas() {
	lista.innerHTML = "";

    let tareasFiltradas = tareas;

    if(filtroActual === "pendientes"){
        tareasFiltradas = tareas.filter(t => !t.completada);
    } else if(filtroActual === "completada"){
        tareasFiltradas = tareas.filter(t => t.completada);
    }

	tareasFiltradas.forEach(tarea => {
        const li = document.createElement("li");
        li.dataset.id = tarea.id;
        if(tarea.completada) li.classList.add("completada");

        //boton completar
        const btnCompletar = document.createElement("button");
        btnCompletar.classList.add("btn-accion", "btn-completar");
        btnCompletar.innerHTML = tarea.completada
            ? `<i data-lucide="check"></i>`
            : `<i data-lucide="circle"></i>`;
        

        //Texto
        const texto = document.createElement("span");
        texto.classList.add("tarea-texto");
        texto.textContent = tarea.texto;

        //Botón borrar
        const btnBorrar = document.createElement("button");
        btnBorrar.classList.add("btn-accion","btn-borrar");
        btnBorrar.innerHTML = `<i data-lucide="trash-2"></i>`;

        li.appendChild(btnCompletar);
        li.appendChild(texto);
        li.appendChild(btnBorrar);

        lista.appendChild(li);
    });

	// IMPORTANTE: activar íconos al renderizar
	lucide.createIcons();
}

/*AGREGAR TAREA*/
function agregarTarea() {
	const texto = input.value.trim();
	if (!texto) return;

    const normalizado = texto.toLowerCase().replace(/\s+/g, " ");
    if(tareas.some(t => t.texto.toLowerCase().replace(/\s+/g, " ") === normalizado)){
        showToast("Esa tarea ya existe", 2000);
        return;
    }

    const nuevaTarea = {
        id: generarID(),
        texto,
        completada: false
    }

	tareas.push(nuevaTarea);
	input.value = "";

	guardarEnLocalStorage();
	renderizarTareas();
    actualizarStats();
	showToast("Tarea agregada", 2000);
}

form.addEventListener("submit", e => {
	e.preventDefault();
	agregarTarea();
});

/*BORRAR TAREA*/
function borrarTarea(id) {
    tareas = tareas.filter(t => t.id !== id);

	guardarEnLocalStorage();
	renderizarTareas();
    actualizarStats();
	showToast("Tarea eliminada", 2000);
}

/*COMPLETAR TAREA*/
function toggleCompletar(id) {
    const tarea = tareas.find(t => t.id === id);
    if(!tarea) return;

	tarea.completada = !tarea.completada;

	guardarEnLocalStorage();
	renderizarTareas();
    actualizarStats();
	showToast("Tarea actualizada", 2000);
}

/* LOCAL STORAGE*/
function guardarEnLocalStorage() {
	localStorage.setItem("tareas", JSON.stringify(tareas));
    localStorage.setItem("ultimoId", JSON.stringify(ultimoId));
}

function cargarDesdeLocalStorage() {
	const data = localStorage.getItem("tareas");
    const idGuardado = JSON.parse(localStorage.getItem("ultimoId"));

	if (data) {
		tareas = JSON.parse(data);
	}else{
        tareas = [];
    }

    if(typeof idGuardado === "number" && !isNaN(idGuardado)){
        ultimoId = idGuardado;
    }else{
        ultimoId = 0;
    }

    renderizarTareas();
    actualizarStats();
}

/* TOASTS */
function showToast(mensaje, duracion = 3000) {
	const contenedor = document.getElementById("toast-container");

	const toast = document.createElement("div");
	toast.classList.add("toast");
	toast.textContent = mensaje;

	contenedor.appendChild(toast);

	setTimeout(() => toast.classList.add("show"), 10);

	setTimeout(() => {
		toast.classList.remove("show");
		setTimeout(() => toast.remove(), 200);
	}, duracion);
}

//Funcion stats
function actualizarStats(){
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = total - completadas;

    const elTotal = document.getElementById("total");
    const elCompletada = document.getElementById("completadas");
    const elPendientes = document.getElementById("pendientes");

    if(!elTotal || !elCompletada || !elPendientes){return;}
   


    elTotal.textContent = total;
    elCompletada.textContent = completadas;
    elPendientes.textContent = pendientes;
}

function generarID(){
    return ++ultimoId;
}

document.getElementById("filtros").addEventListener("click", e =>{
    if(e.target.matches("button")){
        filtroActual = e.target.dataset.filtro;

        document.querySelectorAll("#filtros button").forEach(btn => btn.classList.remove("activo"));

        e.target.classList.add("activo");

        renderizarTareas();
    }
});

// DELEGACIÓN DE EVENTOS PARA BOTONES DE CADA TAREA
lista.addEventListener("click", e => {

    const boton = e.target.closest("button");
    if (!boton) return;

    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    // detectar acción según la clase del botón
    if (boton.classList.contains("btn-completar")) {
        toggleCompletar(id);
    }

    if (boton.classList.contains("btn-borrar")) {
        borrarTarea(id);
    }
});



//Init
cargarDesdeLocalStorage();
