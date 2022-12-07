export default [
    {
        match: "**",
        type: "remapColl",
        filename: "ExcelBinOutput/TalkExcelConfigData.json"
    },
    {
        match: ">=3.3.0",
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