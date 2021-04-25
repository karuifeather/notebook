import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

interface BuildReturnObject {
  code: string;
  error: string;
}

let service: esbuild.Service;

const build = async (rawCode: string): Promise<BuildReturnObject> => {
  if (!service) {
    console.log('Starting service... Please wait!');
    service = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  }

  try {
    const res = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    return { code: res.outputFiles[0].text, error: '' };
  } catch (e) {
    return { code: '', error: e.message };
  }
};

export default build;
