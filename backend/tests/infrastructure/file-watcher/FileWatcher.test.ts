import { describe, it, expect } from 'vitest';
import { FileWatcher } from '../../../src/infrastructure/file-watcher/FileWatcher';
import path from 'path';

describe('FileWatcher (Infrastructure Layer)', () => {
  
  it('Debe lanzar un error si el path proporcionado no existe', () => {
    const pathInexistente = path.join(__dirname, 'no-existe');
    
    // TDD ROJO: El test fallará hasta que la clase esté implementada y valide el path
    expect(() => new FileWatcher(pathInexistente)).toThrow('El path especificado no existe');
  });

  it('Debe inicializarse correctamente con un path válido', () => {
    const pathValido = __dirname;
    const watcher = new FileWatcher(pathValido);
    
    expect(watcher).toBeDefined();
    expect(watcher.getPath()).toBe(pathValido);
  });

});
