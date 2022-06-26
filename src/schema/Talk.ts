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
            BeginWay: 'beginWay',
            ActiveMode: 'activeMode',
            InitDialog: 'initDialog',
            NextRandomTalks: 'nextRandomTalks',
            NpcId: "npcId",
            QuestId: "questId",
            LockGameTime: "lockGameTime",
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