import typescript from '@rollup/plugin-typescript'
import command from 'rollup-plugin-command'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'

import simpleGit from 'simple-git'

export default async function () {
    const git = simpleGit('.')
    return {
        input: 'src/index.ts',
        output: {
            file: 'out/index.js',
            format: 'es'
        },
        plugins: [
            replace({
                values: {
                    __buildDate__: JSON.stringify(new Date()),
                    __version__: JSON.stringify(await git.raw('describe', '--tags')),
                    __branch__: JSON.stringify((await git.status()).current)
                },
                preventAssignment: true
            }),
            typescript(),
            nodeResolve(),
            commonjs(),
            json(),
            command(`sh build.sh`)
        ]
    }
}
