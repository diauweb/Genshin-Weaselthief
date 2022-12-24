export default [
    {
        match: "**",
        type: "remapColl",
        filename: "ExcelBinOutput/LocalizationExcelConfigData.json",
    },
    {
        match: ">=3.3.0",
        remap: {
            Id: 'id',
            AssetType: 'assetType',
            DefaultPath: 'defaultPath',
        },
    },
    {
        match: "*",
        remap: {}
    }
]