export default [
    {
        "match": "**",
        "filename": "ExcelBinOutput/MaterialExcelConfigData.json",
        "type": "remapColl"
    },
    {
        "match": ">=2.7.0",
        "remap": {
            Id: "id",
            NameTextMapHash: "nameTextMapHash",
            DescTextMapHash: "descTextMapHash",
            EffectTextMapHash: "effectTextMapHash",
            SpecialTextMapHash: "specialTextMapHash",
            ItemType: "itemType",
            StackLimit: "stackLimit",
            MaterialType: "materialType",
            Icon: 'icon',
            UseOnGain: 'useOnGain',
            RankLevel: 'rankLevel',
            EffectIcon: 'effectIcon',
            DestroyRule: 'destroyRule'
        }
    },
    {
        "match": "*",
        "remap": {}
    }
]
