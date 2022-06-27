export default [
    {
        "match": "**",
        "filename": "ExcelBinOutput/QuestExcelConfigData.json",
        "type": "remapColl"
    },
    {
        "match": ">=2.7.0",
        "remap": {
            // add master key to dedupe
            "Id": "subId",
            "SubId": "subId",
            "MainId": "mainId",
            "Order": "order",
            "DescTextMapHash": "descTextMapHash",
            "StepTextMapHash": "stepTextMapHash",
            "GuideTextMapHash": "guideTextMapHash",
            "ShowType": "showType",
            "ExclusiveNpcList": "exculsiveNpcList"
        }
    },
    {
        "match": "*",
        "remap": {
            "Id": "SubId",
            "SubId": "SubId",
            "MainId": "MainId",
            "Order": "Order",
            "DescTextMapHash": "DescTextMapHash",
            "StepTextMapHash": "StepTextMapHash",
            "GuideTextMapHash": "GuideTextMapHash",
            "ShowType": "ShowType",
            "ExclusiveNpcList": "ExculsiveNpcList"
        }
    }
]
