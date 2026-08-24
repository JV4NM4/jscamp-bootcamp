import { allJobs, renderJobs } from './fetch-data.js';

let currentPage = 1;

// Captura elementos del HTML
const searchInput = document.querySelector('.search-bar input');
const levelSelect = document.querySelector('#filter-experience');
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