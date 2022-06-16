//@ts-nocheck
export default ({ lang }) => [
    {
        "match": "<=1.5.1",
        "filename": `TextMap/Text${lang === 'JP' ? 'JA' : lang}.json`,
        "type": "all"
    },
    {
        "match": "*",
        "filename": `TextMap/TextMap${lang}.json`,
        "type": "all"
    }
]
