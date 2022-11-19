export default [
    {
        match: "**",
        type: "remapColl",
        filename: "ExcelBinOutput/TalkExcelConfigData.json"
    },
    {
        match: ">=2.7.0",
        remap: {
            Id: '_id',
            BeginWay: '_beginWay',
            ActiveMode: '_activeMode',
            InitDialog: '_initDialog',
            NextRandomTalks: '_nextRandomTalks',
            NpcId: "_npcId",
            QuestId: "_questId",
            LockGameTime: "_lockGameTime",
        }
    },
    {
        match: "*",
        remap: {
            Id: 'Id',
            BeginWay: 'BeginWay',
            ActiveMode: 'ActiveMode',
            InitDialog: 'InitDialog',
            NpcId: "NpcId",
            QuestId: "QuestId",
        }
    }
]