/* Aquí irá el código de tu test */

// @ts-check
import { expect, test } from '@playwright/test'

/*test('La aplicación carga y muestra el buscador', async ({ page }) => {
    await page.goto('http://localhost:5173/')
    const searchInput = page.getByRole ('searchbox')
    await expect(searchInput).toBeVisible()
})
*/

/* test('Permitir búsqueda de empleos por tecnología (React)', async ({ page }) =>{
    await page.goto('http://localhost:5173/')

    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('React')
    await page.getByRole('button', { name: 'Buscar' }).click()
    const primerResultado = page.locator('article').first()
    await expect(primerResultado).toBeVisible()
    await expect(primerResultado).toContainText(/React/i)
}) */

/* test('Flujo completo: Buscar empleo y aplicar a la oferta', async ({ page }) => {

  await page.goto('http://localhost:5173/')

  // Buscar empleos con "JavaScript"
  const searchInput = page.getByRole('searchbox')
  await searchInput.fill('JavaScript')
  await page.getByRole('button', { name: 'Buscar' }).click()

  // 2. Hacer clic en "Ver detalles" del primer resultado
  const primerResultado = page.locator('article').first()
  await primerResultado.getByRole('link', { name: 'Ver detalles' }).click()

  // 3. Verificar que está en la página de detalle
  await expect(page).toHaveURL(/\/jobs\/.+/)

  // 4. Hacer clic en "Iniciar sesión" (Header)
  await page.getByRole('button', { name: /Iniciar sesión/i }).first().click()

  //Rellenar el formulario de Login
  await page.getByLabel('Email').fill('tester@infojobs.com')
  await page.getByLabel('Contraseña').fill('12345678')
  
  // Clic en el botón "Iniciar Sesión" del formulario
  await page.locator('form').getByRole('button', { name: /Iniciar Sesión/i }).click()

  // La app redirige a /search, comprueba que ha llegado
  await expect(page).toHaveURL(/\/search/)

  //Prueba 
  await page.waitForTimeout(1000)

  // 5. Hacer clic en "Aplicar" 
  const botonAplicar = page.locator('.button-apply-job').first()

  await expect(botonAplicar).toBeEnabled()
  await botonAplicar.click()        
  await expect(botonAplicar).toHaveText('Aplicado') 
})
  */
/*
test('Paginación: Permite navegar a la siguiente página de resultados', async ({ page }) => {
  await page.goto('http://localhost:5173/search')

  // 2. Verifica que está el componente de paginación
  const paginacion = page.getByRole('navigation', { name: 'Paginación' })
  await expect(paginacion).toBeVisible()

  // Guarda el título del primer empleo de la página 1 para compararlo después
  const tituloPagina1 = await page.locator('article h3').first().textContent()

  // 3. Clic en "Siguiente"
  const botonSiguiente = paginacion.getByRole('button').last()
  await botonSiguiente.click()

  await page.waitForTimeout(1000)

  // 4. Verifica que cambian los resultados
  // Título del primer empleo de la página 2
  const tituloPagina2 = await page.locator('article h3').first().textContent()
  
  //El título de la página 1 no puedeser igual al de la página 2
  expect(tituloPagina1).not.toBe(tituloPagina2)

  //el botón número 2 ahora está activo
  const botonPagina2 = paginacion.getByRole('button', { name: '2', exact: true })
  await expect(botonPagina2).toHaveAttribute('aria-current', 'page')
})

*/

/*
test('Detalle de empleo: Muestra el detalle y permite aplicar a la oferta', async ({ page }) => {
  // 1.Enhome se loggea primero
  await page.goto('http://localhost:5173/')
  
  await page.getByRole('button', { name: /Iniciar sesión/i }).first().click()
  await page.getByLabel('Email').fill('tester@infojobs.com')
  await page.getByLabel('Contraseña').fill('12345678')
  await page.locator('form').getByRole('button', { name: /Iniciar Sesión/i }).click()

  // 2.Va a search
  await expect(page).toHaveURL(/\/search/)
  await page.waitForTimeout(1000)

  // Guarda el título de la primera oferta para comprobarlo luego
  const primerResultado = page.locator('article').first()
  const tituloOferta = await primerResultado.locator('h3').textContent()
  
  // 3. Clic en el enlace "Ver detalles" del primer resultado
  await primerResultado.getByRole('link', { name: 'Ver detalles' }).click()

  // 4. Verifica que se muestra el detalle del empleo
  // CompruebaURL y que el título coincide con el de la tarjeta
  await expect(page).toHaveURL(/\/jobs\/.+/)
  const tituloDetalle = page.getByRole('heading', { level: 1 }).last()
  await expect(tituloDetalle).toContainText(tituloOferta)

  // 5. Verifica que aparece el botón "Aplicar" y está habilitado
  const botonAplicar = page.getByRole('button', { name: 'Aplicar', exact: true })
  await expect(botonAplicar).toBeVisible()
  await expect(botonAplicar).toBeEnabled()

  // 6. Clic en "Aplicar"
  await botonAplicar.click()

  // 7. Verifica que el botón cambia a "Aplicado"
  const botonAplicado = page.getByRole('button', { name: 'Aplicado', exact: true })
  await expect(botonAplicado).toBeVisible()
})
*/

// Dejo tus tests comentados tal cual estaban y hago las adaptaciones aquí
test.describe('Ejercicio 2: Navegación básica', () => {
  test('La aplicación carga y muestra el buscador', async ({ page }) => {
    await page.goto('/')

    // Como el buscador está dentro de un <form role="search">, por eso su rol es 'searchbox'
    const searchInput = page.getByRole('searchbox')
    await expect(searchInput).toBeVisible()
  })
})

test.describe('Ejercicio 3: Búsqueda por tecnología', () => {
  test('Permite buscar empleos por tecnología (React)', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('searchbox').fill('React')
    await page.getByRole('button', { name: 'Buscar' }).click()

    // Buscamos por rol 'article' en vez de selector CSS para seguir buenas practicas de testing (siempre debemos evitar selectores por clase)
    const primerResultado = page.getByRole('article').first()
    await expect(primerResultado).toBeVisible()
    await expect(primerResultado).toContainText(/React/i)
  })
})

test.describe('Ejercicio 4: Flujo completo de aplicación', () => {
  test('Buscar empleo, ver detalle, iniciar sesión y aplicar', async ({ page }) => {
    await page.goto('/')

    // 1. Buscamos empleos con "JavaScript"
    await page.getByRole('searchbox').fill('JavaScript')
    await page.getByRole('button', { name: 'Buscar' }).click()

    // Esperamos a que cargue el listado: el link "Ver detalles" solo existe en los resultados
    await expect(page.getByRole('link', { name: 'Ver detalles' }).first()).toBeVisible()

    // 2. Clic en "Ver detalles" del primer resultado
    const primerResultado = page.getByRole('article').first()
    // Guardamos el título de la oferta antes de salir del listado
    const tituloOferta = await primerResultado.getByRole('heading', { level: 3 }).textContent()
    await primerResultado.getByRole('link', { name: 'Ver detalles' }).click()

    // 3. Verificamos que se muestra el detalle del empleo (URL y h1 con el título)
    await expect(page).toHaveURL(/\/jobs\/.+/)
    // Filtramos el h1 por el título para ignorar el h1 "DevJobs" del header (la API puede tardar en responder)
    await expect(page.getByRole('heading', { level: 1, name: tituloOferta })).toBeVisible({ timeout: 10000 })

    // 4. Hacer clic en "Iniciar sesión" del header
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()
    await page.getByLabel('Email').fill('tester@infojobs.com')
    await page.getByLabel('Contraseña').fill('12345678')
    // Scope al <form> para no confundir este botón con el "Iniciar sesión" del header
    await page.locator('form').getByRole('button', { name: 'Iniciar Sesión' }).click()

    // El login redirige a /search
    await expect(page).toHaveURL(/\/search/)

    // 5. Hacer clic en "Aplicar" de la primera oferta (sin sesión el botón está deshabilitado)
    const botonAplicar = page.getByRole('article').first().getByRole('button', { name: 'Aplicar', exact: true })
    await expect(botonAplicar).toBeEnabled()
    await botonAplicar.click()

    // 6. El botón cambia a "Aplicado" (lo buscamos de nuevo porque cambió su texto)
    await expect(page.getByRole('article').first().getByRole('button', { name: 'Aplicado' })).toBeVisible()
  })
})

test.describe('Ejercicio 5: Filtros', () => {
  test('Filtrar por ubicación: Remoto', async ({ page }) => {
    await page.goto('/search')

    // Esperamos a que cargue la lista inicial para no pisar el fetch del filtro
    await expect(page.getByText(/Se encontraron \d+ trabajos/)).toBeVisible()

    await page.getByLabel('Ubicación').selectOption({ label: 'Remoto' })
    // Los select solo se aplican al enviar el formulario con "Aplicar filtros"
    await page.getByRole('button', { name: 'Aplicar filtros' }).click()

    // El filtro aplicado queda reflejado en la URL
    await expect(page).toHaveURL(/type=remoto/)

    // Esperamos a que cargue la lista filtrada: el total baja a las 10 ofertas remotas
    await expect(page.getByText('Se encontraron 10 trabajos')).toBeVisible({ timeout: 10000 })

    // Todos los resultados deben ser remotos
    for (const resultado of await page.getByRole('article').all()) {
      await expect(resultado).toContainText('Remoto')
    }
  })

  test('Filtrar por nivel: Senior', async ({ page }) => {
    await page.goto('/search')

    await page.getByLabel('Nivel de experiencia').selectOption({ label: 'Senior' })
    await page.getByRole('button', { name: 'Aplicar filtros' }).click()

    // La tarjeta no muestra el nivel, así que verificamos el filtro en la URL y que hay resultados
    await expect(page).toHaveURL(/level=senior/)
    await expect(page.getByRole('article').first()).toBeVisible()
  })
})

test.describe('Ejercicio 6: Paginación', () => {
  test('Permite navegar a la siguiente página de resultados', async ({ page }) => {
    await page.goto('/search')

    // La paginación es un <nav aria-label="Paginación">
    const paginacion = page.getByRole('navigation', { name: 'Paginación' })
    await expect(paginacion).toBeVisible()

    // Guardamos el título del primer empleo de la página 1 para compararlo después
    const primerTitulo = page.getByRole('article').first().getByRole('heading', { level: 3 })
    const tituloPagina1 = await primerTitulo.textContent()

    // Clic en "Siguiente" (el botón de flecha ahora tiene aria-label)
    await paginacion.getByRole('button', { name: 'Página siguiente' }).click()

    // Esperamos a que el primer resultado sea distinto, sin waitForTimeout
    await expect(primerTitulo).not.toHaveText(tituloPagina1)

    // El botón "2" queda marcado como página actual
    const botonPagina2 = paginacion.getByRole('button', { name: '2', exact: true })
    await expect(botonPagina2).toHaveAttribute('aria-current', 'page')
  })
})

test.describe('Ejercicio 7: Detalle de empleo', () => {
  test('Muestra el detalle y permite aplicar a la oferta', async ({ page }) => {
    // Iniciamos sesión primero porque el botón "Aplicar" está deshabilitado sin sesión
    await page.goto('/')
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()
    await page.getByLabel('Email').fill('tester@infojobs.com')
    await page.getByLabel('Contraseña').fill('12345678')
    // Scope al <form> para no confundir este botón con el "Iniciar sesión" del header
    await page.locator('form').getByRole('button', { name: 'Iniciar Sesión' }).click()
    await expect(page).toHaveURL(/\/search/)

    // Guardamos el título de la primera oferta para compararlo en el detalle
    const primerResultado = page.getByRole('article').first()
    await expect(primerResultado).toBeVisible()
    const tituloOferta = await primerResultado.getByRole('heading', { level: 3 }).textContent()

    // 1. Clic en el primer resultado de la búsqueda
    await primerResultado.getByRole('link', { name: 'Ver detalles' }).click()

    // 2. Verificar que se muestra el detalle: misma URL de empleo y mismo título en el h1
    await expect(page).toHaveURL(/\/jobs\/.+/)
    // Filtramos el h1 por el título para ignorar el h1 "DevJobs" del header (la API puede tardar en responder)
    await expect(page.getByRole('heading', { level: 1, name: tituloOferta })).toBeVisible({ timeout: 10000 })

    // 3. Verificar que aparece el botón "Aplicar" y está habilitado
    const botonAplicar = page.getByRole('button', { name: 'Aplicar ahora' })
    await expect(botonAplicar).toBeEnabled()

    // 4. Clic en "Aplicar" y el botón cambia a "Aplicado" (lo buscamos de nuevo porque cambió su texto)
    await botonAplicar.click()
    await expect(page.getByRole('button', { name: 'Aplicado' })).toBeVisible()
  })
})