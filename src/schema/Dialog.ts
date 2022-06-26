export default [
    {
        match: "**",
        type: "remapColl",
        filename: "ExcelBinOutput/DialogExcelConfigData.json"
    },
    {
        match: ">=2.7.0",
        remap: {
            Id: 'id',
            NextDialogs: 'nextDialogs',
            TalkShowType: 'talkShowType',
            TalkRole__Type: 'talkRole._type',
            TalkRole__Id: 'talkRole._id',
            TalkContentTextMapHash: "talkContentTextMapHash",
            TalkTitleTextMapHash: "talkTitleTextMapHash",
            TalkRoleNameTextMapHash: "talkRoleNameTextMapHash",
        }
    },
    {
        match: "*",
        remap: {
            Id: 'Id',
            NextDialogs: 'NextDialogs',
            TalkShowType: 'TalkShowType',
            TalkRole__Type: 'TalkRole.Type',
            TalkRole__Id: 'TalkRole.Id',
            TalkContentTextMapHash: "TalkContentTextMapHash",
            TalkTitleTextMapHash: "TalkTitleTextMapHash",
            TalkRoleNameTextMapHash: "TalkRoleNameTextMapHash",
        }
    }
]