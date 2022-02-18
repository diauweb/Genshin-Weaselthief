
/**
 * @roxi/routify 2.18.4
 * File generated Fri Feb 18 2022 11:10:41 GMT+0000 (Coordinated Universal Time)
 */

export const __version = "2.18.4"
export const __timestamp = "2022-02-18T11:10:41.607Z"

//buildRoutes
import { buildClientTree } from "@roxi/routify/runtime/buildRoutes"

//imports


//options
export const options = {}

//tree
export const _tree = {
  "root": true,
  "children": [
    {
      "isDir": true,
      "ext": "",
      "children": [
        {
          "isPage": true,
          "path": "/dialog/:id",
          "id": "_dialog__id",
          "component": () => import('../src/pages/dialog/[id].svelte').then(m => m.default)
        }
      ],
      "path": "/dialog"
    },
    {
      "isIndex": true,
      "isPage": true,
      "path": "/index",
      "id": "_index",
      "component": () => import('../src/pages/index.svelte').then(m => m.default)
    },
    {
      "isPage": true,
      "path": "/search_dialogs",
      "id": "_search_dialogs",
      "component": () => import('../src/pages/search_dialogs.svelte').then(m => m.default)
    },
    {
      "isPage": true,
      "path": "/search_text",
      "id": "_search_text",
      "component": () => import('../src/pages/search_text.svelte').then(m => m.default)
    },
    {
      "isDir": true,
      "ext": "",
      "children": [
        {
          "isPage": true,
          "path": "/text/:id",
          "id": "_text__id",
          "component": () => import('../src/pages/text/[id].svelte').then(m => m.default)
        }
      ],
      "path": "/text"
    }
  ],
  "isLayout": true,
  "path": "/",
  "id": "__layout",
  "component": () => import('../src/pages/_layout.svelte').then(m => m.default)
}


export const {tree, routes} = buildClientTree(_tree)

