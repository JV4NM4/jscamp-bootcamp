import { allJobs, renderJobs } from './fetch-data.js';

let currentPage = 1;

// Captura elementos del HTML
/* Evitemos este tipo de selectores, si necesitamos acceder a un elemento para darle una funcionalidad, es mejor manejarnos por `id` */
// const searchInput = document.querySelector('.search-bar input');
const searchInput = document.getElementById('empleos-search-input');
/* Si ya vamos a seleccionar por `id`, entonces usemos `getElementById` */
const filterLocation = document.getElementById('filter-location');
const filterExperience = document.getElementById('filter-type');
const levelSelect = document.getElementById('filter-experience');
const filterTechnology = document.getElementById('filter-technology');

// Buscador por título
searchInput?.addEventListener('input', (event) => {
  const textoBuscado = event.target.value.toLowerCase();
  const empleosFiltrados = allJobs.filter(job => job.titulo.toLowerCase().includes(textoBuscado));
  
  currentPage = 1;
  renderJobs(empleosFiltrados, currentPage);
});

// Filtro por experiencia
levelSelect?.addEventListener('change', (event) => {
  const nivelSeleccionado = event.target.value;
  const empleosFiltrados = allJobs.filter(job => {
    if (nivelSeleccionado === '') return true;
    return job.data.nivel === nivelSeleccionado;
  });
  
  currentPage = 1;
  renderJobs(empleosFiltrados, currentPage);
});

// Filtro por tecnologías
filterTechnology?.addEventListener('change', () => {
  const tecnologiasSeleccionadas = [];
  const opcionesMarcadas = filterTechnology.selectedOptions;

  for (let i = 0; i < opcionesMarcadas.length; i++) {
    tecnologiasSeleccionadas.push(opcionesMarcadas[i].value);
  }

  if (tecnologiasSeleccionadas.length === 0) {
    currentPage = 1;
    renderJobs(allJobs, currentPage);
    return;
  }

  const empleosFiltrados = allJobs.filter(job => {
    return tecnologiasSeleccionadas.some(tech => job.data.technology.includes(tech));
  });

  currentPage = 1;
  renderJobs(empleosFiltrados, currentPage);
});