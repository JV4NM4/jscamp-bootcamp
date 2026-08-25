import { allJobs, renderJobs } from './fetch.js';

let currentPage = 1;

// Captura elementos del HTML
/* Evitemos este tipo de selectores, si necesitamos acceder a un elemento para darle una funcionalidad, es mejor manejarnos por `id` */
// const searchInput = document.querySelector('.search-bar input');
const searchInput = document.getElementById('empleos-search-input');
/* Si ya vamos a seleccionar por `id`, entonces usemos `getElementById` */
const filterTechnology = document.getElementById('filter-technology');
const filterLocation = document.getElementById('filter-location');
const filterType = document.getElementById('filter-type'); 
const filterLevel = document.getElementById('filter-level');

// Función de evaluación de filtros simultáneos
function aplicarFiltros() {
  // Guardo el estado actual de cada input
const textoBuscado = searchInput ? searchInput.value.toLowerCase() : '';
  const tecnologiaSeleccionada = filterTechnology ? filterTechnology.value : '';
  const ubicacionSeleccionada = filterLocation ? filterLocation.value : '';
  const tipoSeleccionado = filterType ? filterType.value : '';
  const nivelSeleccionado = filterLevel ? filterLevel.value : '';
  // Filtro de todas las condiciones
  const empleosFiltrados = allJobs.filter(job => {
    
    const coincideTexto = job.titulo.toLowerCase().includes(textoBuscado); 
    const coincideTecnologia = tecnologiaSeleccionada === '' || job.data.technology.includes(tecnologiaSeleccionada);
    const coincideUbicacion = ubicacionSeleccionada === '' || job.ubicacion.toLowerCase() === ubicacionSeleccionada;
    const coincideTipo = tipoSeleccionado === '' || job.data.modalidad === tipoSeleccionado;
    const coincideNivel = nivelSeleccionado === '' || job.data.nivel === nivelSeleccionado;

    return coincideTexto && coincideTecnologia && coincideUbicacion && coincideTipo && coincideNivel;
  });

  // Renderizo los empleos filtrados
  currentPage = 1;
  renderJobs(empleosFiltrados, currentPage);
}

//Asigno la funcióna todos los eventos
searchInput?.addEventListener('input', aplicarFiltros);
filterTechnology?.addEventListener('change', aplicarFiltros);
filterLocation?.addEventListener('change', aplicarFiltros);
filterType?.addEventListener('change', aplicarFiltros);
filterLevel?.addEventListener('change', aplicarFiltros);