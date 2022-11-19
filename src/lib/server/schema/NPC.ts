export default [
    {
        "match": "**",
        "filename": "ExcelBinOutput/NpcExcelConfigData.json",
        "type": "remapColl"
    },
    {
        "match": ">=2.7.0",
        "remap": {
            "Id": "id",
            "NameTextMapHash": "nameTextMapHash"
        }
    },
    {
        "match": "*",
        "remap": {
            "Id": "Id",
            "NameTextMapHash": "NameTextMapHash"
        }
    }
]
