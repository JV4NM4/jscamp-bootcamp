// 1. Variables
export let allJobs = [];
export const RESULTS_PER_PAGE = 3;

// 2. Contenedores del HTML
const container = document.querySelector('.jobs-listings');
const paginationContainer = document.querySelector('.pagination');

// 3. Función para pintar las tarjetas 
export function renderJobs(jobsToRender, currentPage = 1) {
  // Vaciado  del contenedor
  container.innerHTML = '';

  // Actualización del contador de resultados
  const contador = document.querySelector('#resultados-contador');
  if (contador) {
    contador.textContent = `Mostrando ${jobsToRender.length} de ${allJobs.length} ofertas`;
  }

  // Lógica de paginación 
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const jobsToShow = jobsToRender.slice(startIndex, endIndex);

  // REnderizado de las 3 tarjetas correspondientes
  jobsToShow.forEach(job => {
    const article = document.createElement('article');
    article.className = 'job-listing-card';
    /* Es una opción, lo agregamos para que te quede de ejemplo, lo qur hiciste está perfecto! La intención de esto es que puedas ver diferentes formas de hacer lo mismo, en este caso con un enfoque más funcional y menos imperativo */
    handleAddDataAttributes(article, [
      ['empresa', job.empresa],
      ['ubicacion', job.ubicacion],
      ['modalidad', job.modalidad],
      ['nivel', job.nivel],
      ['technology', job.technology],
    ]);
    /* article.dataset.modalidad = job.data.modalidad;
    article.dataset.nivel = job.data.nivel;
    article.dataset.technology = job.data.technology; */

    const textWrapper = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = job.titulo;
    const meta = document.createElement('small');
    meta.textContent = `${job.empresa} | ${job.ubicacion}`;
    const description = document.createElement('p');
    description.textContent = job.descripcion;

    textWrapper.append(title, meta, description);

    const applyButton = document.createElement('button');
    applyButton.className = 'button-apply-job';
    applyButton.textContent = 'Aplicar';

    article.append(textWrapper, applyButton);
    container.appendChild(article);
  });

  // Generación de los botones numéricos de paginación
  if (paginationContainer) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(jobsToRender.length / RESULTS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = '#';
      pageLink.textContent = i;
      
      if (i === currentPage) {
        pageLink.classList.add('is-active');
        pageLink.setAttribute('aria-current', 'page');
      }
      
      paginationContainer.appendChild(pageLink);
    }
  }
}

// 4. Inicialización
fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    allJobs = data;
    renderJobs(allJobs, 1);
  })
  .catch(error => console.error('Error al cargar el JSON:', error));

/* --- */
/* Una cosa que podemos hacer es crear handlers, para simplificar la lectura del código dentro de funciones (al leer el nombre de la función ya sabes que hace sin tener que leer el código) */

const handleAddDataAttributes = (element, dataAttributes = []) => {
  dataAttributes.forEach(([attribute, value]) => {
    element.dataset[attribute] = value
  });

  return element
}