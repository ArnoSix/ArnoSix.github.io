const talleres = [];
const reservas = [];
const inventario = {};

function mostrarSeccion(id){

document.querySelectorAll('.seccion').forEach(sec=>{
sec.classList.remove('activa');
});

document.getElementById(id).classList.add('activa');
}

function crearTaller(){

const nombre = document.getElementById('nuevoTaller').value;

if(!nombre){
alert('Ingresa nombre del taller');
return;
}

talleres.push(nombre);

inventario[nombre] = {
insumos: [],
herramientas: []
};

actualizarSelects();
actualizarTalleres();
actualizarDashboard();

document.getElementById('nuevoTaller').value = '';
}

function actualizarTalleres(){

const lista = document.getElementById('listaTalleres');

lista.innerHTML = '';

talleres.forEach(taller=>{

lista.innerHTML += `
<div class="item">
${taller}
</div>
`;

});
}

function actualizarSelects(){

const selects = [
document.getElementById('reservaTaller'),
document.getElementById('inventarioTaller')
];

selects.forEach(select=>{

select.innerHTML = '';

talleres.forEach(taller=>{

select.innerHTML += `
<option>${taller}</option>
`;

});

});

mostrarInventario();
}

function guardarReserva(){

const taller = document.getElementById('reservaTaller').value;
const docente = document.getElementById('docente').value;
const fecha = document.getElementById('fecha').value;
const hora = document.getElementById('hora').value;

if(!taller || !docente || !fecha || !hora){
alert('Completa todos los campos');
return;
}

reservas.push({
taller,
docente,
fecha,
hora
});

actualizarReservas();
actualizarDashboard();
}

function actualizarReservas(){

const tabla = document.getElementById('tablaReservas');

tabla.innerHTML = '';

reservas.forEach(r=>{

tabla.innerHTML += `
<tr>
<td>${r.taller}</td>
<td>${r.docente}</td>
<td>${r.fecha}</td>
<td>${r.hora}</td>
</tr>
`;

});
}

function agregarInsumo(){

const taller = document.getElementById('inventarioTaller').value;
const nombre = document.getElementById('nombreInsumo').value;
const cantidad = document.getElementById('cantidadInsumo').value;

if(!taller || !nombre || !cantidad){
alert('Completa todos los campos');
return;
}

inventario[taller].insumos.push({
nombre,
cantidad
});

mostrarInventario();
actualizarDashboard();
}

function agregarHerramienta(){

const taller = document.getElementById('inventarioTaller').value;
const nombre = document.getElementById('nombreHerramienta').value;
const estado = document.getElementById('estadoHerramienta').value;

if(!taller || !nombre){
alert('Completa los campos');
return;
}

inventario[taller].herramientas.push({
nombre,
estado
});

mostrarInventario();
}

function mostrarInventario(){

const taller = document.getElementById('inventarioTaller').value;

if(!taller || !inventario[taller]){
return;
}

const listaInsumos = document.getElementById('listaInsumos');
const listaHerramientas = document.getElementById('listaHerramientas');

listaInsumos.innerHTML = '';
listaHerramientas.innerHTML = '';

inventario[taller].insumos.forEach(i=>{

listaInsumos.innerHTML += `
<div class="item">
${i.nombre} - ${i.cantidad} unidades
</div>
`;

});

inventario[taller].herramientas.forEach(h=>{

listaHerramientas.innerHTML += `
<div class="item">
${h.nombre} - ${h.estado}
</div>
`;

});
}

document.addEventListener('change', function(e){

if(e.target.id === 'inventarioTaller'){
mostrarInventario();
}

});

function actualizarDashboard(){

document.getElementById('totalTalleres').innerText = talleres.length;
document.getElementById('totalReservas').innerText = reservas.length;

let totalInsumos = 0;

Object.keys(inventario).forEach(taller=>{
totalInsumos += inventario[taller].insumos.length;
});

document.getElementById('totalInsumos').innerText = totalInsumos;
}

function exportarExcel(){

const workbook = XLSX.utils.book_new();

const wsReservas = XLSX.utils.json_to_sheet(reservas);
XLSX.utils.book_append_sheet(workbook, wsReservas, "Reservas");

const talleresExcel = talleres.map(t=>({taller:t}));
const wsTalleres = XLSX.utils.json_to_sheet(talleresExcel);
XLSX.utils.book_append_sheet(workbook, wsTalleres, "Talleres");

const insumos = [];
const herramientas = [];

Object.keys(inventario).forEach(taller=>{

inventario[taller].insumos.forEach(i=>{
insumos.push({
taller,
nombre:i.nombre,
cantidad:i.cantidad
});
});

inventario[taller].herramientas.forEach(h=>{
herramientas.push({
taller,
nombre:h.nombre,
estado:h.estado
});
});

});

const wsInsumos = XLSX.utils.json_to_sheet(insumos);
const wsHerramientas = XLSX.utils.json_to_sheet(herramientas);

XLSX.utils.book_append_sheet(workbook, wsInsumos, "Insumos");
XLSX.utils.book_append_sheet(workbook, wsHerramientas, "Herramientas");

XLSX.writeFile(workbook, "sistema_talleres.xlsx");
}