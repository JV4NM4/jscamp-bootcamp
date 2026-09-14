/* Aquí irá tu código del primer ejercicio */
import Database from "better-sqlite3";

//1. Conexión.
const db = new Database('jobs.db');

//2. Activar modo WAL. Mejora rendimiento en concurrencia
db.pragma('journal_mode=WAL');

//3. Hablilitar claves foráneas
db.pragma('foreign_keys = ON');

//4. Exportar db
export { db }
