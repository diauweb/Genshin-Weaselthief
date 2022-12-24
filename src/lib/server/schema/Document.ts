export default [
    {
        match: "**",
        type: "remapColl",
        filename: "ExcelBinOutput/DocumentExcelConfigData.json",
    },
    {
        match: ">=3.3.0",
        remap: {
            Id: 'id',
            TitleTextMapHash: 'titleTextMapHash',
            ContentLocalizedId: 'contentLocalizedId',
            PreviewPath: 'previewPath',
            VideoPath: 'videoPath',
        }
    },
    {
        match: "*",
        remap: {}
    }
]