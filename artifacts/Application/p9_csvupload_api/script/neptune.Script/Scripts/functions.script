function resetAll() {
    tableName = tabData = tableHeader = tableHeaderMetadata = fileName = dictionaryDetails = undefined;
    progcount = 0, chunklength = 0;
    inpTableName.setValue("");
    fuCSV.setValue("");
    selSeparator.setSelectedKey("detect");
    chkHeaderRow.setSelected(true);
    var oFirstStep = oWizard.getSteps()[0];
    oWizard.discardProgress(oFirstStep);
    oWizard.goToStep(oFirstStep);
    btnNextStep.setText("Next");
    oTableData.removeAllColumns();
    columnListTableData.removeAllCells();
    modeloTableData.setData([]);
    modeloTableData.refresh();
    modeloTableExisting.setData([]);
    modeloTableExisting.refresh();
    oProgressIndicator.setState("Warning");
    oProgressIndicator.setPercentValue(0);
    omsgError.setType("Success");
    omsgError.setText("");
    omsgError.setVisible(false);
    chkExistingTable.setSelected(false);
    chkExistingTable.fireSelect();
    chkAPICreate.setVisible(false);
    chkAPICreate.setSelected(false);
    chkDeleteAllRows.setSelected(false);
    seldiaTables.getBinding("items").filter([]);
    inpSelTables.setValue("");
}

function replaceKeys(arr, obj) {
    const keys = Object.keys(obj);
    const res = {};
    for (let a in arr) {
        if (arr[a] !== keys[a]) {
            res[arr[a]] = obj[keys[a]];
            obj[arr[a]] = obj[keys[a]];
            delete obj[keys[a]];
        }
    };
};

function createRESTAPI() {

    var columnObject = {
        "id": uuidv4(),
        "parent": "",
        "name": "",
        "objectType": ""
    };
    var columnObjectArray = [];

    $.each(tableHeaderMetadata, function (key, value) {
        var obj = JSON.parse(JSON.stringify(columnObject));
        obj.name = value.fieldName;
        obj.objectType = getDataTypeforAPI(value.fieldType);
        columnObjectArray.push(obj);
    });
    var finalObjectArray = columnObjectArray.concat(auditFields);
    var payloadAPI = createAPIPayload();
    payloadAPI.definitions[0].properties = finalObjectArray;

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/functions/API/Save",
        data: JSON.stringify(payloadAPI),
        success: function (data) {
            sap.m.MessageToast.show("Successfully created REST API: 'API " + tableName + "' for table '" + tableName + "' !");
            msgAPICreate.setText("Successfully created REST API: 'API " + tableName + "' for table '" + tableName + "' !");
            msgAPICreate.setType("Success");
        },
        error: function (result, status) {
            sap.m.MessageToast.show("Error creating REST API : " + result.responseJSON.status);
            msgAPICreate.setText("Error creating REST API : " + result.responseJSON.status);
            msgAPICreate.setType("Error");
        }
    });

}

function getDataTypeforAPI(sourceDataType) {
    switch (sourceDataType.toLowerCase()) {
        case "uuid":
        case "text":
        case "smalltext":
        case "mediumtext":
        case "timestamptz":
        case "timestamp":
            return "string";
        case "decimal":
            return "number";
        case "boolean":
            return "boolean";
        case "smallint":
        case "bigint":
        case "integer":
            return "integer";
        case 'json':
            return 'object'
    }
}


function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


function buildDataTable() {
    $.each(tableHeader, function (key, value) {
        var colTableData = new sap.m.Column("colTableData" + key, {});
        var lblTableData = new sap.m.Text("lblTableData" + key, {
            text: value
        });
        oTableData.addColumn(colTableData);
        colTableData.setHeader(lblTableData);

        var txtTableData = new sap.m.Text("txtTableData" + key, {
            text: "{" + value + "}"
        });
        columnListTableData.addCell(txtTableData);
    });

    modeloTableData.setData(tabData);
    modeloTableData.refresh();
    oTableData.setHeaderText("Rows: " + tabData.length);
}


function chunk(arr, len) {
    var chunks = [],
        i = 0,
        n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
}

function saveData(chunkeddata, counter) {
    progcount += chunkeddata[counter].length;
    var payload = {
        'table': tableName,
        'data': chunkeddata[counter]
    };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/functions/Entity/Save",
        data: JSON.stringify(payload),
        success: function (data) {
            setProgress(progcount, modeloTableData.oData.length);
            counter++;
            checkDone(chunkeddata, counter);
        },
        error: function (result, status) {
            sap.m.MessageToast.show("Error saving data to table : " + result.responseJSON.status);
            omsgError.setVisible(true);
            omsgError.setType("Error");
            omsgError.setText("Error saving data to table : " + result.responseJSON.status);
            objstatUpload.setState("Error");
            objstatUpload.setText("Error");
            oProgressIndicator.setState("Error");
            btnReset.setEnabled(true);
            btnNextStep.setEnabled(true);
            chkAPICreate.setVisible(false);
        }
    });
}

function checkDone(data, counter) {
    if (counter < chunklength) {
        saveData(data, counter);
    } else {
        btnReset.setEnabled(true);
        btnNextStep.setEnabled(true);
        chkAPICreate.setVisible(true);
        sap.m.MessageToast.show("Data from file '" + fileName + "' was successfully uploaded to table '" + tableName + "' !");
        objstatUpload.setState("Success");
        objstatUpload.setText("Success");
        oProgressIndicator.setState("Success");
        omsgError.setVisible(true);
        omsgError.setText("Data from file '" + fileName + "' was successfully uploaded to table '" + tableName + "' !");
        omsgError.setType("Success");
    }
}

function setProgress(current, total) {
    oProgressIndicator.setDisplayValue("Saving record " + current + " of " + total + "...");
    oProgressIndicator.setPercentValue(parseInt((current * 100 / total)));
    if (current === total) {
        oProgressIndicator.setDisplayValue('Saved ' + total + ' records to database table...');
    }
}


function createAPIPayload() {
    return {
        "id": uuidv4(),
        "name": "API " + tableName,
        "endpoint": "/api/entity",
        "mediaType": "application/json",
        "apiType": "table",
        "paths": [{
            "id": uuidv4(),
            "path": "/" + tableName,
            "method": "GET",
            "headers": [],
            "parameters": [{
                "name": "where",
                "description": "{ \"fieldName\": \"value\"}  or { \"fieldName\": \"Not(value)\"} or { \"fieldName\": \"Between(1,10)\"} or {fieldName: In([\"value1\", \"value2\"])}\n Other operators - LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Like, Any, IsNull, Raw"
            },
            {
                "name": "select",
                "description": "fieldName1,fieldName2,fieldName3"
            },
            {
                "name": "take",
                "description": "Limit (paginated) - max number of entities that should be taken"
            },
            {
                "name": "skip",
                "description": "Offset (paginated) from where entities should be taken"
            },
            {
                "name": "order",
                "description": "{\"fieldName1\": \"ASC\", \"fieldName2\": \"DESC\"}"
            }
            ],
            "content": [],
            "responses": [{
                "status": 200,
                "headers": [],
                "content": [{
                    "objectType": "array",
                    "name": tableName
                }]
            },
            {
                "status": 400,
                "headers": [],
                "content": [{
                    "objectType": "object",
                    "name": "Error"
                }]
            }
            ]
        },
        {
            "id": uuidv4(),
            "path": "/" + tableName,
            "method": "PUT",
            "headers": [],
            "parameters": [],
            "content": [{
                "objectType": "array",
                "name": tableName
            }],
            "responses": [{
                "status": 200,
                "headers": [],
                "content": [{
                    "objectType": "array",
                    "name": tableName
                }]
            },
            {
                "status": 400,
                "headers": [],
                "content": [{
                    "objectType": "object",
                    "name": "Error"
                }]
            }
            ]
        },
        {
            "id": uuidv4(),
            "path": "/" + tableName,
            "method": "POST",
            "headers": [],
            "parameters": [{
                "name": "where",
                "example": "{ \"fieldName\": \"value\"}  or { \"fieldName\": \"Not(value)\"} or { \"fieldName\": \"Between(1,10)\"} or {fieldName: In([\"value1\", \"value2\"])}\n Other operators - LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Like, Any, IsNull, Raw"
            }],
            "content": [{
                "objectType": "array",
                "name": tableName
            }],
            "responses": [{
                "status": 200,
                "headers": [],
                "content": [{
                    "objectType": "array",
                    "name": tableName
                }]
            },
            {
                "status": 400,
                "headers": [],
                "content": [{
                    "objectType": "object",
                    "name": "Error"
                }]
            }
            ]
        },
        {
            "id": uuidv4(),
            "path": "/" + tableName,
            "method": "DELETE",
            "headers": [],
            "parameters": [{
                "name": "where",
                "example": "{ \"fieldName\": \"value\"}  or { \"fieldName\": \"Not(value)\"} or { \"fieldName\": \"Between(1,10)\"} or {fieldName: In([\"value1\", \"value2\"])}\n Other operators - LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Like, Any, IsNull, Raw"
            }],
            "content": [],
            "responses": [{
                "status": 200,
                "headers": [],
                "content": [{
                    "objectType": "array",
                    "name": tableName
                }]
            },
            {
                "status": 400,
                "headers": [],
                "content": [{
                    "objectType": "object",
                    "name": "Error"
                }]
            }
            ]
        }
        ],
        "definitions": [{
            "id": uuidv4(),
            "name": tableName,
            "properties": []
        },
        {
            "id": uuidv4(),
            "name": "Error",
            "properties": [{
                "id": uuidv4(),
                "parent": "",
                "name": "status",
                "objectType": "string"
            },
            {
                "id": uuidv4(),
                "parent": "",
                "name": "message",
                "objectType": "string"
            }
            ]
        }
        ],

        "enableIDE": true
    };
}