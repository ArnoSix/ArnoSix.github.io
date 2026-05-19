import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

apiKey: "PEGA_TU_APIKEY",
authDomain: "TU_PROYECTO.firebaseapp.com",
projectId: "TU_PROYECTO",
storageBucket: "TU_PROYECTO.appspot.com",
messagingSenderId: "123456",
appId: "APP_ID"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const talleres = [];
const reservas = [];
const inventario = {
insumos: [],
herramientas: []
};

window.mostrarSeccion = function(id){

document.querySelectorAll('.seccion').forEach(sec=>{
sec.classList.remove('activa');
});

document.getElementById(id).classList.add('activa');
}

window.crearTaller = async function(){

const nombre = document.getElementById('nuevoTaller').value;

if(!nombre){
alert('Ingresa nombre');
return;
}

await addDoc(collection(db,"talleres"),{
nombre:nombre
});

document.getElementById('nuevoTaller').value='';
}

window.guardarReserva = async function(){

const taller = document.getElementById('reservaTaller').value;

const docente = document.getElementById('docente').value;

const fecha = document.getElementById('fecha').value;

const hora = document.getElementById('hora').value;

if(!docente || !fecha || !hora){
alert('Completa los campos');
return;
}

await addDoc(collection(db,"reservas"),{
taller,
docente,
fecha,
hora
});

}

window.agregarInsumo = async function(){

const taller = document.getElementById('inventarioTaller').value;

const nombre = document.getElementById('nombreInsumo').value;

const cantidad = document.getElementById('cantidadInsumo').value;

if(!nombre || !cantidad){
alert('Completa los campos');
return;
}

await addDoc(collection(db,"insumos"),{
taller,
nombre,
cantidad
});

}

window.agregarHerramienta = async function(){

const taller = document.getElementById('inventarioTaller').value;

const nombre = document.getElementById('nombreHerramienta').value;

const estado = document.getElementById('estadoHerramienta').value;

if(!nombre){
alert('Completa los campos');
return;
}

await addDoc(collection(db,"herramientas"),{
taller,
nombre,
estado
});

}

onSnapshot(collection(db,"talleres"),(snapshot)=>{

talleres.length = 0;

snapshot.forEach(doc=>{

talleres.push(doc.data());

});

actualizarTalleres();
actualizarSelects();
actualizarDashboard();

});

onSnapshot(collection(db,"reservas"),(snapshot)=>{

reservas.length = 0;

snapshot.forEach(doc=>{

reservas.push(doc.data());

});

actualizarReservas();
actualizarDashboard();

});

onSnapshot(collection(db,"insumos"),(snapshot)=>{

inventario.insumos = [];

snapshot.forEach(doc=>{

inventario.insumos.push(doc.data());

});

mostrarInventario();
actualizarDashboard();

});

onSnapshot(collection(db,"herramientas"),(snapshot)=>{

inventario.herramientas = [];

snapshot.forEach(doc=>{

inventario.herramientas.push(doc.data());

});

mostrarInventario();

});

function actualizarTalleres(){

const lista = document.getElementById('listaTalleres');

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

const tabla = document.getElementById('tablaReservas');

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

const taller = document.getElementById('inventarioTaller').value;

const listaInsumos = document.getElementById('listaInsumos');

const listaHerramientas = document.getElementById('listaHerramientas');

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

window.exportarExcel = function(){

const workbook = XLSX.utils.book_new();

const wsReservas = XLSX.utils.json_to_sheet(reservas);

XLSX.utils.book_append_sheet(
workbook,
wsReservas,
"Reservas"
);

const talleresExcel = talleres.map(t=>({
taller:t.nombre
}));

const wsTalleres = XLSX.utils.json_to_sheet(talleresExcel);

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