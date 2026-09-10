import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'


//4.- Comprobación de permisos de lectura del directorio

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
            size: formatBytes(info.size),
        }
    })
);

// Filtros
if (onlyFiles) entries = entries.filter(e => !e.isDir);
if (onlyDirs) entries = entries.filter(e => e.isDir);

// Orden
if (isAsc) {
    entries.sort((a, b) => {
        if (a.name < b.name) return -1; // "a" va antes
        if (a.name > b.name) return 1;  // "b" va antes
        return 0;                       // Son iguales
    });
}

// Renderizado
for (const entry of entries) {
    const icon = entry.isDir ? '📁' : '📄';
    const size = entry.isDir ? '-' : `${entry.size}`;
    console.log(`${icon.padEnd(3)} ${entry.name.padEnd(25)} ${size}`);
}