import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';


//4.- Comprobación de permisos de lectura del directorio

// Excelente! Una alternativa más corta es !process.permission?.has('fs.read') con `.?`
if (process.permission && !process.permission.has('fs.read')) {
  console.error('Error: No tiene permisos para leer este directorio. Use --allow-fs-read="*"');
  process.exit(1);
}

const args = process.argv.slice(2);

//2.- Orden alfabético de los archivos, ascentente o descendente

const isAsc = args.includes('--asc');
const isDesc = args.includes('--desc');

//3.- Filtro por tipo 

const onlyFiles = args.includes('--files');
const onlyDirs = args.includes('--folders');

//1.- Obtener directorio

const dir = args.find(arg => !arg.startsWith('--')) ?? '.';

const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
}

const files = await readdir(dir);

let entries = await Promise.all(
    files.map(async (name) => {
        const fullPath = join(dir, name);
        const info = await stat(fullPath);
        return {
            name,
            isDir: info.isDirectory(),
            size: info.size, // No hacemos el format aquí. Lo haremos más adelante cuando sepamos que la entry es un file y no un folder
        }
    })
);

// Filtros
if (onlyFiles) entries = entries.filter(e => !e.isDir);
if (onlyDirs) entries = entries.filter(e => e.isDir);

// Orden
if (isAsc || isDesc) {
    entries.sort((a, b) => {
        const cmp = a.name.localeCompare(b.name);
        return isDesc ? -cmp : cmp; // invierte el signo para descendente. No estaba funcionando con ese flag
    });
}

// Renderizado
for (const entry of entries) {
    const icon = entry.isDir ? '📁' : '📄';
    const size = entry.isDir ? '-' : formatBytes(entry.size); // Aquí si ejecutamos el formatBytes
    console.log(`${icon.padEnd(3)} ${entry.name.padEnd(25)} ${size}`);
}