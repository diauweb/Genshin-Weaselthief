import {  currentOid, find, findOne } from "./db.js"

export async function searchDialogContaining (mapId: string) {
    console.time(`search dialog ${mapId}`)
    const nid = parseInt(mapId)
    const rst = await findOne('Dialog', {
      _ver: currentOid(),
      $or: [
        { TalkContentTextMapHash: nid },
        { TalkTitleTextMapHash: nid },
        { TalkRoleNameTextMapHash: nid }
      ]
    })
    console.timeEnd(`search dialog ${mapId}`)
    return rst
}

export async function getDialog (id: string) {
    return findOne('Dialog', {
        _ver: currentOid(),
        Id: parseInt(id)
    });
}

export async function getAllDialogs (id: string) {
  console.time(`all_dialogs ${id}`)
  type Dialog = { Id: number, NextDialogs: number[] }
  const baseDialog = await getDialog(id) as unknown as Dialog

  // backward find initial dialog first
  async function prev (k : Dialog) : Promise<Dialog> {
    const nextDoc = await findOne('Dialog', {
        _ver: currentOid(),
        NextDialogs: k.Id
    }) as unknown as Dialog;

    return nextDoc? prev(nextDoc) : k;
  }

  const first = await prev(baseDialog)
  console.timeLog(`all_dialogs ${id}`, 'first', first.Id)

  const dialogs = new Map<number, Dialog>()
  dialogs.set(first.Id, first)

  async function dfs (d: Dialog) {
      for (const n of d.NextDialogs) {
          if (dialogs.has(n)) continue
          const cur = await getDialog(`${n}`) as unknown as Dialog;
          dialogs.set(n, cur);
          await dfs(cur);
      }
  }
  await dfs(first)

  console.timeEnd(`all_dialogs ${id}`)
  return Array.from(dialogs.values())
}

export async function searchTalkByDialog (id: string) {
  type Dialog = { Id: number, NextDialogs: number[] }
  const baseDialog = await getDialog(id) as unknown as Dialog

  // backward find initial dialog first
  async function prev (k : Dialog) : Promise<Dialog> {
    const nextDoc = await findOne('Dialog', {
        _ver: currentOid(),
        NextDialogs: k.Id
    }) as unknown as Dialog;

    return nextDoc? prev(nextDoc) : k;
  }

  const first = await prev(baseDialog)
  return searchTalkByInitDialog(first.Id)
}

async function searchTalkByInitDialog (id: number) {
  console.time(`search talk by init dialog ${id}`)
  const rst = await findOne('Talk', {
    _ver: currentOid(),
    InitDialog: id
  })
  console.timeEnd(`search talk by init dialog ${id}`)
  return { result: rst }
}

export async function getTalk (id: string) {
    return {
        result: await findOne('Talk', {
            _ver: currentOid(),
            Id: parseInt(id)
        })
    }
}

export async function getReminder (id: string) {
    const result = await findOne('Reminder', {
        _ver: currentOid(),
        Id: parseInt(id)
    });
    return { result }
}

export async function searchReminder (id: string) {
    const result = await findOne('Reminder', {
        _ver: currentOid(),
        $or: [
            { SpeakerTextMapHash: parseInt(id) },
            { ContentTextMapHash: parseInt(id) },
        ]
    })
    return { result }
}