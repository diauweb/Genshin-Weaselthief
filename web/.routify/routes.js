
/**
 * @roxi/routify 2.18.4
 * File generated Fri Feb 18 2022 09:06:14 GMT+0000 (Coordinated Universal Time)
 */

export const __version = "2.18.4"
export const __timestamp = "2022-02-18T09:06:14.609Z"

//buildRoutes
import { buildClientTree } from "@roxi/routify/runtime/buildRoutes"

//imports


//options
export const options = {}

//tree
export const _tree = {
  "name": "_layout",
  "filepath": "/_layout.svelte",
  "root": true,
  "ownMeta": {},
  "absolutePath": "/workspaces/Genshin-WeaselThief/web/src/pages/_layout.svelte",
  "children": [
    {
      "isFile": false,
      "isDir": true,
      "file": "dialog",
      "filepath": "/dialog",
      "name": "dialog",
      "ext": "",
      "badExt": false,
      "absolutePath": "/workspaces/Genshin-WeaselThief/web/src/pages/dialog",
      "children": [
        {
          "isFile": true,
          "isDir": false,
          "file": "[id].svelte",
          "filepath": "/dialog/[id].svelte",
          "name": "[id]",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/workspaces/Genshin-WeaselThief/web/src/pages/dialog/[id].svelte",
          "importPath": "../src/pages/dialog/[id].svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/dialog/:id",
          "id": "_dialog__id",
          "component": () => import('../src/pages/dialog/[id].svelte').then(m => m.default)
        }
      ],
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": false,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/dialog"
    },
    {
      "isFile": true,
      "isDir": false,
      "file": "index.svelte",
      "filepath": "/index.svelte",
      "name": "index",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/workspaces/Genshin-WeaselThief/web/src/pages/index.svelte",
      "importPath": "../src/pages/index.svelte",
      "isLayout": false,
      "isReset": false,
      "isIndex": true,
      "isFallback": false,
      "isPage": true,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/index",
      "id": "_index",
      "component": () => import('../src/pages/index.svelte').then(m => m.default)
    },
    {
      "isFile": true,
      "isDir": false,
      "file": "search_dialogs.svelte",
      "filepath": "/search_dialogs.svelte",
      "name": "search_dialogs",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/workspaces/Genshin-WeaselThief/web/src/pages/search_dialogs.svelte",
      "importPath": "../src/pages/search_dialogs.svelte",
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": true,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/search_dialogs",
      "id": "_search_dialogs",
      "component": () => import('../src/pages/search_dialogs.svelte').then(m => m.default)
    },
    {
      "isFile": true,
      "isDir": false,
      "file": "search_text.svelte",
      "filepath": "/search_text.svelte",
      "name": "search_text",
      "ext": "svelte",
      "badExt": false,
      "absolutePath": "/workspaces/Genshin-WeaselThief/web/src/pages/search_text.svelte",
      "importPath": "../src/pages/search_text.svelte",
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": true,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/search_text",
      "id": "_search_text",
      "component": () => import('../src/pages/search_text.svelte').then(m => m.default)
    },
    {
      "isFile": false,
      "isDir": true,
      "file": "text",
      "filepath": "/text",
      "name": "text",
      "ext": "",
      "badExt": false,
      "absolutePath": "/workspaces/Genshin-WeaselThief/web/src/pages/text",
      "children": [
        {
          "isFile": true,
          "isDir": false,
          "file": "[id].svelte",
          "filepath": "/text/[id].svelte",
          "name": "[id]",
          "ext": "svelte",
          "badExt": false,
          "absolutePath": "/workspaces/Genshin-WeaselThief/web/src/pages/text/[id].svelte",
          "importPath": "../src/pages/text/[id].svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "recursive": true,
            "preload": false,
            "prerender": true
          },
          "path": "/text/:id",
          "id": "_text__id",
          "component": () => import('../src/pages/text/[id].svelte').then(m => m.default)
        }
      ],
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "isPage": false,
      "ownMeta": {},
      "meta": {
        "recursive": true,
        "preload": false,
        "prerender": true
      },
      "path": "/text"
    }
  ],
  "isLayout": true,
  "isReset": false,
  "isIndex": false,
  "isFallback": false,
  "isPage": false,
  "isFile": true,
  "file": "_layout.svelte",
  "ext": "svelte",
  "badExt": false,
  "importPath": "../src/pages/_layout.svelte",
  "meta": {
    "recursive": true,
    "preload": false,
    "prerender": true
  },
  "path": "/",
  "id": "__layout",
  "component": () => import('../src/pages/_layout.svelte').then(m => m.default)
}


export const {tree, routes} = buildClientTree(_tree)

