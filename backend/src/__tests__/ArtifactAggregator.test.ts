import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ArtifactAggregator } from '../infrastructure/artifact-aggregator/ArtifactAggregator';
import fs from 'fs';
import { execSync } from 'child_process';

vi.mock('fs');
vi.mock('child_process');

describe('ArtifactAggregator', () => {
  const rootPath = '/fake/project';
  let aggregator: ArtifactAggregator;

  beforeEach(() => {
    vi.clearAllMocks();
    aggregator = new ArtifactAggregator(rootPath);
  });

  it('debe consolidar archivos modificados detectados por Git', () => {
    // Simular git status --porcelain devolviendo dos archivos
    (execSync as any).mockReturnValue(Buffer.from('M  src/app.ts\nM  README.md\n'));
    
    // Simular existencia y stats
    (fs.existsSync as any).mockReturnValue(true);
    (fs.statSync as any).mockReturnValue({ isFile: () => true });

    // Simular lectura de archivos
    (fs.readFileSync as any).mockImplementation((path: string) => {
      if (path.includes('src/app.ts')) return 'console.log("hello");';
      if (path.includes('README.md')) return '# Project';
      return '';
    });

    const result = aggregator.recolectarArtefactos();

    expect(result).toContain('<<< ARTIFACT: src/app.ts');
    expect(result).toContain('console.log("hello");');
    expect(result).toContain('<<< ARTIFACT: README.md');
    expect(result).toContain('# Project');
    expect(result).toContain('<<< END ARTIFACT >>>');
  });

  it('debe ignorar archivos que no estén en la whitelist', () => {
    (execSync as any).mockReturnValue(Buffer.from('M  image.png\nM  src/logic.ts\n'));
    (fs.existsSync as any).mockReturnValue(true);
    (fs.statSync as any).mockReturnValue({ isFile: () => true });
    (fs.readFileSync as any).mockReturnValue('code');

    const result = aggregator.recolectarArtefactos();
    
    expect(result).toContain('src/logic.ts');
    expect(result).not.toContain('image.png');
  });
});
