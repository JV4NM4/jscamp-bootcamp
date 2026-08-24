const filterTechnology = document.getElementById('filter-technology');

filterTechnology?.addEventListener('change', function () {
  console.log('Tecnología seleccionada:', filterTechnology.value);
});

const filterLocation = document.getElementById('filter-location');

filterLocation?.addEventListener('change', function () {
  console.log('Ubicación seleccionada:', filterLocation.value);
});

const filterType = document.getElementById('filter-type');

filterType?.addEventListener('change', function () {
  console.log('Tipo de contrato seleccionado:', filterType.value);
});

const filterExperience = document.getElementById('filter-experience');

filterExperience?.addEventListener('change', function () {
  console.log('Nivel de experiencia seleccionada:', filterExperience.value);
});