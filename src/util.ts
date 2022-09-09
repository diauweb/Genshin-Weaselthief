import { find } from './db.js'

export async function inlineLanguage(resultItem: any) {
    const translate: Record<string, string> = {};
    for (const k of Object.keys(resultItem)) {
      if (!k.endsWith("TextMapHash")) continue;
      translate[resultItem[k]] = k;
    }
  
    const q = (await find("TextMap", {
      _ver: resultItem._ver,
      hash: { $in: Object.keys(translate).map(i => parseInt(i)) }
    }))
    
    q.forEach(e => resultItem[translate[e.hash]] = e)
    Object.values(translate).forEach(e => {
      if (typeof resultItem[e] !== 'object') {
        const hs = resultItem[e]
        resultItem[e] = { hash: hs }
      }
    })
  
    return resultItem;
  }
  