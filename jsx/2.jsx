var csv = File.openDialog("Select CSV File", "CSV File:*.csv", false);
var data = [];
try {
    csv.open('r');
    csv.encoding = "Default";
    while (!csv.eof) {
        var InputLine = csv.readln();
        if (InputLine != "" && InputLine.length > 10) {
            if (InputLine.split(',').length >= 3) {
                var ld = InputLine.split(",");
                data.push(ld);
            }
        }
    }
    csv.close();
} catch (e) {
    alert("Csv File Error\nError Massage\n" + e, "Csv File Error");
}

if (data.length > 1) {
    if (File(csv.path + '/' + data[1][2]).exists) {
        var importFrom = Folder(csv.path);
    } else {
        var importFrom = Folder.selectDialog("Select Image Folder");
    }
    if (importFrom != null && importFrom != undefined) {
        var firstName, lastName;
        var doc = app.activeDocument;
        try {
            firstName = doc.layers.getByName('First Name');
            lastName = doc.layers.getByName('Last Name');
        } catch (e) { }
        var imageGroup;
        try {
            imageGroup = doc.layerSets.getByName('File Name');
        } catch (l) {
            imageGroup = doc.layerSets.add();
            imageGroup.name = 'File Name';
        }

        var nameGroup;
        for (var d = 1; d < data.length; d++) {
            if (firstName && lastName) {
                try {
                    nameGroup = doc.layerSets.getByName('Names');
                } catch (l) {
                    nameGroup = doc.layerSets.add();
                    nameGroup.name = 'Names';
                }
                var newFirstName = firstName.duplicate(nameGroup, ElementPlacement.PLACEATEND);
                newFirstName.textItem.contents = data[d][0];
                newFirstName.name = data[d][0];
                newFirstName.visible = false;
                var newlastName = lastName.duplicate(nameGroup, ElementPlacement.PLACEATEND);
                newlastName.textItem.contents = data[d][1];
                newlastName.name = data[d][1];
                newlastName.visible = false;
            }
            //doc.activeLayer=imageGroup;
            var newFile = File(importFrom + '/' + data[d][2]);
            if (newFile.exists) {
                fillimage(newFile);
                if (imageGroup.layers.length > 0) {
                    doc.activeLayer.move(imageGroup.layers[0], ElementPlacement.PLACEBEFORE);
                } else {
                    doc.activeLayer.move(imageGroup, ElementPlacement.PLACEATEND);
                }
                doc.activeLayer.visible = false;
            }
        }
    } else {
        alert('One or more Text Layer For Name is Not Found');
    }
}

function fillimage(fil) {
    try {
        var desc1 = new ActionDescriptor();
        desc1.putPath(charIDToTypeID('null'), new File(fil));
        desc1.putEnumerated(charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), stringIDToTypeID("QCSAverage"));
        var desc2 = new ActionDescriptor();
        desc2.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), 0);
        desc2.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), 0);
        desc1.putObject(charIDToTypeID('Ofst'), charIDToTypeID('Ofst'), desc2);
        executeAction(charIDToTypeID('Plc '), desc1);
        return true;
    } catch (e) {
        return false;
    }
}  