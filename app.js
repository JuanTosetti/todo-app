const input = document.getElementById("inputTarea");
const lista = document.getElementById("listaTareas");
const form = document.getElementById("formTarea");

let tareas = [];

/*RENDERIZAR TAREAS*/
function renderizarTareas() {
	lista.innerHTML = "";

	tareas.forEach((tarea, index) => {
		const li = document.createElement("li");
		li.classList.add("tarea");
		if (tarea.completada) li.classList.add("completada");

		const texto = document.createElement("span");
		texto.classList.add("tarea-texto");
		texto.textContent = tarea.texto;

		/* Botón completar */
		const btnCompletar = document.createElement("button");
		btnCompletar.classList.add("btn-accion");
		btnCompletar.innerHTML = tarea.completada
			? `<i data-lucide="check"></i>`
			: `<i data-lucide="circle"></i>`;
		btnCompletar.onclick = () => toggleCompletar(index);

		/* Botón borrar */
		const btnBorrar = document.createElement("button");
		btnBorrar.classList.add("btn-accion");
		btnBorrar.innerHTML = `<i data-lucide="trash-2"></i>`;
		btnBorrar.onclick = () => borrarTarea(index);

		li.appendChild(texto);
		li.appendChild(btnCompletar);
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

	tareas.push({ texto, completada: false });
	input.value = "";

	renderizarTareas();
	guardarEnLocalStorage();
    actualizarStats();
	showToast("Tarea agregada", 2000);
}

form.addEventListener("submit", e => {
	e.preventDefault();
	agregarTarea();
});

/*BORRAR TAREA*/
function borrarTarea(index) {
	tareas.splice(index, 1);
	renderizarTareas();
	guardarEnLocalStorage();
    actualizarStats();
	showToast("Tarea eliminada", 2000);
}

/*COMPLETAR TAREA*/
function toggleCompletar(index) {
	tareas[index].completada = !tareas[index].completada;
	renderizarTareas();
	guardarEnLocalStorage();
    actualizarStats();
	showToast("Tarea actualizada", 2000);
}

/* LOCAL STORAGE*/
function guardarEnLocalStorage() {
	localStorage.setItem("tareas", JSON.stringify(tareas));
}

function cargarDesdeLocalStorage() {
	const data = localStorage.getItem("tareas");
	if (data) {
		tareas = JSON.parse(data);
		renderizarTareas();
	}
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
    

    if(!elTotal || !elCompletada || !elPendientes){
        return;
    }
   

    
    elTotal.textContent = total;
    elCompletada.textContent = completadas;
    elPendientes.textContent = pendientes;
}


//Init
cargarDesdeLocalStorage();
