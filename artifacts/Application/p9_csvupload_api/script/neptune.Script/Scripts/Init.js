jQuery.sap.require("sap.m.MessageBox");

var tableName,
    tabData,
    tableHeader,
    tableHeaderMetadata,
    fileName,
    dictionaryDetails,
    progcount = 0,
    chunklength = 0,
    chunksize = 1000,
    wizstepLoadCSV_var,
    wizstepExistingTable_var,
    wizstepReviewSchema_var,
    wizstepReviewData_var,
    wizStepUploadData_var,
    wizStepAPICreate_var;

var auditFields = [
    {
        id: uuidv4(),
        parent: "",
        name: "id",
        description: "Unique record ID",
        objectType: "string",
    },
    {
        id: uuidv4(),
        parent: "",
        name: "createdAt",
        description: "Date when record was created",
        objectType: "number",
    },
    {
        id: uuidv4(),
        parent: "",
        name: "createdBy",
        description: "Created By",
        objectType: "string",
    },
    {
        id: uuidv4(),
        parent: "",
        name: "updatedAt",
        description: "Date when record was updated",
        objectType: "number",
    },
    {
        id: uuidv4(),
        parent: "",
        name: "updatedBy",
        description: "Updated By",
        objectType: "string",
    },
];

sap.ui.getCore().attachInit(function (data) {
    setTimeout(function () {
        oWizard._getProgressNavigator().ontap = function () {};
        chkExistingTable.fireSelect();
        //oWizard.setCurrentStep(wizStepUploadData);
    }, 200);
});
