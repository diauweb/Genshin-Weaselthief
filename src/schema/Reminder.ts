export default [
    {
        match: "**",
        type: "remapColl",
        filename: "ExcelBinOutput/ReminderExcelConfigData.json"
    },
    {
        match: ">=2.7.0",
        remap: {
            Id: 'id',
            SpeakerTextMapHash: 'speakerTextMapHash',
            ContentTextMapHash: 'contentTextMapHash',
            NextReminderId: 'nextReminderId',
            ShowTime: 'showTime',
        }
    },
    {
        match: "*",
        remap: {
            Id: 'Id',
            SpeakerTextMapHash: 'SpeakerTextMapHash',
            ContentTextMapHash: 'ContentTextMapHash',
            NextReminderId: 'NextReminderId',
            ShowTime: 'ShowTime',
        }
    }
]