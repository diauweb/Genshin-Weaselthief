import typescript from '@rollup/plugin-typescript'
import command from 'rollup-plugin-command'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'

export default {
    input: 'src/index.ts',
    output: {
        file: 'out/index.js',
        format: 'es'
    },
    plugins: [
        typescript(),
        nodeResolve(),
        commonjs(),
        json(),
        command(`sh build.sh`)
    ]
}