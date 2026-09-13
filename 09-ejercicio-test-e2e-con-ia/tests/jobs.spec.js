/* Aquí irá el código de tu test */

// @ts-check
import { test, expect } from '@playwright/test'

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