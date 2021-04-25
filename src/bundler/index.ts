import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin';
import { fetchPlugin } from '../plugins/fetch-plugin';

let service: esbuild.Service;

const build = async (rawCode: string): Promise<string> => {
  if (!service) {
    console.log('Starting service... Please wait!');
    service = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  }

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

  return res.outputFiles[0].text;
};

export default build;
