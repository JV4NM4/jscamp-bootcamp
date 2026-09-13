/*
 * Aquí debes escribir tus tests para la API de jobs
 *
 * Recuerda:
 * - Usar node:test y node:assert (sin dependencias externas)
 * - Levantar el servidor con before() y cerrarlo con after()
 * - Testear todos los endpoints: GET, POST, PUT, PATCH, DELETE
 * - Verificar validaciones con Zod
 * - Comprobar códigos de estado HTTP correctos
 */
import test, { describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import  app  from './app.js'

const PORT = 5678
const baseURL = `http://localhost:${PORT}`
let server

// Levanta el servidor antes de los tests
before(async () => {
  await new Promise((resolve) => {
    server = app.listen(PORT, resolve)
  })
})

// Cierra el servidor al terminar
after(async () => {
  await new Promise((resolve) => {
    server.close(resolve)
  })
})

describe('GET /jobs', () => {
  test('Debe responder con 200 y un array de trabajos', async () => {
    const res = await fetch(`${baseURL}/jobs`)
    assert.strictEqual(res.status, 200)
    const json = await res.json()
    assert.ok(Array.isArray(json.data), 'json.data debe ser un array')
  })

  test('Debe filtrar trabajos por tecnología (react)', async () => {
    const res = await fetch(`${baseURL}/jobs?technology=react`)
    const json = await res.json()
    const allHaveReact = json.data.every(job => job.data.technology.includes('react'))
    assert.ok(allHaveReact, 'Todos los trabajos devueltos deben incluir la tecnología react')
  })

  test('Debe respetar el límite de resultados', async () => {
    const res = await fetch(`${baseURL}/jobs?limit=2`)
    const json = await res.json()
    assert.strictEqual(json.limit, 2)
    assert.strictEqual(json.data.length, 2)
  })

  test('Debe aplicar offset correctamente', async () => {
    // Pide todos para saber cuál es el segundo
    const resAll = await fetch(`${baseURL}/jobs`)
    const jsonAll = await resAll.json()
    const secondJobId = jsonAll.data[1].id

    // Ahora  pide con offset=1
    const resOffset = await fetch(`${baseURL}/jobs?offset=1`)
    const jsonOffset = await resOffset.json()
    assert.strictEqual(jsonOffset.data[0].id, secondJobId)
  })
})

describe('POST /jobs', () => {
  const validJob = {
    titulo: "Desarrollador Testing",
    empresa: "QA Solutions",
    ubicacion: "Remoto",
    descripcion: "Prueba de validación",
    data: { technology: ["jest", "node"] }
  }

  test('El nuevo trabajo se añade correctamente con buen formato', async () => {
    const res = await fetch(`${baseURL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validJob)
    })
    assert.strictEqual(res.status, 201)
    const json = await res.json()
    assert.ok(json.id, 'Debe generar un ID')
    assert.strictEqual(json.titulo, validJob.titulo)
  })

  test('La petición es validada correctamente por Zod (casos de error y éxito)', async () => {
    // 1. Título corto (< 3)
    let res = await fetch(`${baseURL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validJob, titulo: "ab" })
    })
    assert.strictEqual(res.status, 400)

    // 2. Título largo (> 100)
    res = await fetch(`${baseURL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validJob, titulo: "a".repeat(101) })
    })
    assert.strictEqual(res.status, 400)

    // 3. Faltan campos requeridos (sin título)
    res = await fetch(`${baseURL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresa: "Test", ubicacion: "Test" })
    })
    assert.strictEqual(res.status, 400)

    // 4. Título no es string
    res = await fetch(`${baseURL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validJob, titulo: 12345 })
    })
    assert.strictEqual(res.status, 400)

    // 5. Sin campo descripción (es opcional) -> DEBE PASAR (201)
    const { descripcion, ...jobWithoutDesc } = validJob
    res = await fetch(`${baseURL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobWithoutDesc)
    })
    assert.strictEqual(res.status, 201)
  })
})

describe('GET /jobs/:id', () => {
  const validId = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'

  test('Debe devolver el trabajo con ID especificado', async () => {
    const res = await fetch(`${baseURL}/jobs/${validId}`)
    assert.strictEqual(res.status, 200)
    const json = await res.json()
    assert.strictEqual(json.id, validId)
  })

  test('Debe enviar 404 cuando el ID no existe', async () => {
    const res = await fetch(`${baseURL}/jobs/id-inventado-123`)
    assert.strictEqual(res.status, 404)
    const json = await res.json()
    assert.ok(json.error)
  })
})

describe('PUT /jobs/:id', () => {
  const validId = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'

  test('Debe recibir 204 y actualizar el trabajo completo', async () => {
    const updatedJob = { 
      titulo: "Actualizado", 
      empresa: "NewCorp", 
      ubicacion: "Marte", 
      data: { technology: ["space"] } 
    }
    const res = await fetch(`${baseURL}/jobs/${validId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedJob)
    })
    assert.strictEqual(res.status, 204)
    
    // Hace el GET para comprobar que se actualizó
    const resGet = await fetch(`${baseURL}/jobs/${validId}`)
    const jsonGet = await resGet.json()
    assert.strictEqual(jsonGet.titulo, "Actualizado")
  })

  test('Debe devolver 404 cuando el ID no existe', async () => {
    const res = await fetch(`${baseURL}/jobs/id-inventado-123`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: "Fail", empresa: "Fail", ubicacion: "Fail" })
    })
    assert.strictEqual(res.status, 404)
  })
})

describe('PATCH /jobs/:id', () => {
  const validId = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'

  test('Debe recibir 204 y actualizar solo los campos enviados', async () => {
    const patchData = { ubicacion: "Luna" }
    const res = await fetch(`${baseURL}/jobs/${validId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchData)
    })
    assert.strictEqual(res.status, 204)

    // Hace el GET para comprobar el cambio
    const resGet = await fetch(`${baseURL}/jobs/${validId}`)
    const jsonGet = await resGet.json()
    assert.strictEqual(jsonGet.ubicacion, "Luna")
  })

  test('Debe devolver 404 cuando el ID no existe', async () => {
    const res = await fetch(`${baseURL}/jobs/id-inventado-123`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: "No existo" })
    })
    assert.strictEqual(res.status, 404)
  })
})

describe('DELETE /jobs/:id', () => {
  const validId = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'

  test('Debe recibir 204 y eliminar el trabajo', async () => {
    const res = await fetch(`${baseURL}/jobs/${validId}`, { method: 'DELETE' })
    assert.strictEqual(res.status, 204)

    // Hace GET y verifica que devuelve 404 porque ya no existe
    const resGet = await fetch(`${baseURL}/jobs/${validId}`)
    assert.strictEqual(resGet.status, 404)
  })

  test('Debe devolver 404 cuando el ID no existe', async () => {
    const res = await fetch(`${baseURL}/jobs/id-inventado-123`, { method: 'DELETE' })
    assert.strictEqual(res.status, 404)
  })
})
