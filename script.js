const talleres = [];
const reservas = [];

const inventario = {
insumos: [],
herramientas: []
};

function mostrarSeccion(id){

document.querySelectorAll('.seccion').forEach(sec=>{
sec.classList.remove('activa');
});

document.getElementById(id).classList.add('activa');

}

function crearTaller(){

const nombre =
document.getElementById('nuevoTaller').value;

if(!nombre){
alert('Ingresa nombre');
return;
}

talleres.push({
nombre:nombre
});

actualizarTalleres();
actualizarSelects();
actualizarDashboard();

document.getElementById('nuevoTaller').value='';

}

function guardarReserva(){

const taller =
document.getElementById('reservaTaller').value;

const docente =
document.getElementById('docente').value;

const fecha =
document.getElementById('fecha').value;

const hora =
document.getElementById('hora').value;

if(!docente || !fecha || !hora){
alert('Completa campos');
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

function agregarInsumo(){

const taller =
document.getElementById('inventarioTaller').value;

const nombre =
document.getElementById('nombreInsumo').value;

const cantidad =
document.getElementById('cantidadInsumo').value;

if(!nombre || !cantidad){
alert('Completa campos');
return;
}

inventario.insumos.push({
taller,
nombre,
cantidad
});

mostrarInventario();
actualizarDashboard();

}

function agregarHerramienta(){

const taller =
document.getElementById('inventarioTaller').value;

const nombre =
document.getElementById('nombreHerramienta').value;

const estado =
document.getElementById('estadoHerramienta').value;

if(!nombre){
alert('Completa campos');
return;
}

inventario.herramientas.push({
taller,
nombre,
estado
});

mostrarInventario();

}

function actualizarTalleres(){

const lista =
document.getElementById('listaTalleres');

lista.innerHTML='';

talleres.forEach(t=>{

lista.innerHTML += `
<div class="item">
${t.nombre}
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

select.innerHTML='';

talleres.forEach(t=>{

select.innerHTML += `
<option>${t.nombre}</option>
`;

});

});

}

function actualizarReservas(){

const tabla =
document.getElementById('tablaReservas');

tabla.innerHTML='';

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

function mostrarInventario(){

const taller =
document.getElementById('inventarioTaller').value;

const listaInsumos =
document.getElementById('listaInsumos');

const listaHerramientas =
document.getElementById('listaHerramientas');

listaInsumos.innerHTML='';
listaHerramientas.innerHTML='';

inventario.insumos
.filter(i=>i.taller===taller)
.forEach(i=>{

listaInsumos.innerHTML += `
<div class="item">
${i.nombre} - ${i.cantidad}
</div>
`;

});

inventario.herramientas
.filter(h=>h.taller===taller)
.forEach(h=>{

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

document.getElementById('totalTalleres').innerText =
talleres.length;

document.getElementById('totalReservas').innerText =
reservas.length;

document.getElementById('totalInsumos').innerText =
inventario.insumos.length;

}

function exportarExcel(){

const workbook = XLSX.utils.book_new();

const wsReservas =
XLSX.utils.json_to_sheet(reservas);

XLSX.utils.book_append_sheet(
workbook,
wsReservas,
"Reservas"
);

const talleresExcel = talleres.map(t=>({
taller:t.nombre
}));

const wsTalleres =
XLSX.utils.json_to_sheet(talleresExcel);

XLSX.utils.book_append_sheet(
workbook,
wsTalleres,
"Talleres"
);

const wsInsumos =
XLSX.utils.json_to_sheet(inventario.insumos);

const wsHerramientas =
XLSX.utils.json_to_sheet(inventario.herramientas);

XLSX.utils.book_append_sheet(
workbook,
wsInsumos,
"Insumos"
);

XLSX.utils.book_append_sheet(
workbook,
wsHerramientas,
"Herramientas"
);

XLSX.writeFile(
workbook,
"sistema_talleres.xlsx"
);

}
