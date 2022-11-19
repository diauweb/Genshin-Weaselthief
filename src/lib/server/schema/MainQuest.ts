export default [
    {
        "match": "**",
        "filename": "ExcelBinOutput/MainQuestExcelConfigData.json",
        "type": "remapColl"
    },
    {
        "match": ">=2.7.0",
        "remap": {
            "Id": "id",
            "Series": "series",
            "Type": "type",
            "ActiveMode": "activeMode",
            "TitleTextMapHash": "titleTextMapHash",
            "DescTextMapHash": "descTextMapHash",
            "ShowType": "showType",
            "LuaPath": "luaPath"
        }
    },
    {
        "match": "*",
        "remap": {
            "Id": "Id",
            "Series": "Series",
            "Type": "Type",
            "ActiveMode": "ActiveMode",
            "TitleTextMapHash": "TitleTextMapHash",
            "DescTextMapHash": "DescTextMapHash",
            "ShowType": "ShowType",
            "LuaPath": "LuaPath"
        }
    }
]
