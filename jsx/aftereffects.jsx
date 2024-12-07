"object" != typeof JSON && (JSON = {}), function () { "use strict"; var rx_one = /^[\],:{}\s]*$/, rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rx_four = /(?:^|:|,)(?:\s*\[)+/g, rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta, rep; function f(t) { return t < 10 ? "0" + t : t } function this_value() { return this.valueOf() } function quote(t) { return rx_escapable.lastIndex = 0, rx_escapable.test(t) ? '"' + t.replace(rx_escapable, function (t) { var e = meta[t]; return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + t + '"' } function str(t, e) { var r, n, o, u, f, a = gap, i = e[t]; switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(t)), "function" == typeof rep && (i = rep.call(e, t, i)), typeof i) { case "string": return quote(i); case "number": return isFinite(i) ? String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; if (gap += indent, f = [], "[object Array]" === Object.prototype.toString.apply(i)) { for (u = i.length, r = 0; r < u; r += 1)f[r] = str(r, i) || "null"; return o = 0 === f.length ? "[]" : gap ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]" : "[" + f.join(",") + "]", gap = a, o } if (rep && "object" == typeof rep) for (u = rep.length, r = 0; r < u; r += 1)"string" == typeof rep[r] && (o = str(n = rep[r], i)) && f.push(quote(n) + (gap ? ": " : ":") + o); else for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i)) && f.push(quote(n) + (gap ? ": " : ":") + o); return o = 0 === f.length ? "{}" : gap ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}" : "{" + f.join(",") + "}", gap = a, o } } "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value), "function" != typeof JSON.stringify && (meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, JSON.stringify = function (t, e, r) { var n; if (indent = gap = "", "number" == typeof r) for (n = 0; n < r; n += 1)indent += " "; else "string" == typeof r && (indent = r); if ((rep = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify"); return str("", { "": t }) }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) { var j; function walk(t, e) { var r, n, o = t[e]; if (o && "object" == typeof o) for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (void 0 !== (n = walk(o, r)) ? o[r] = n : delete o[r]); return reviver.call(t, e, o) } if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function (t) { return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j; throw new SyntaxError("JSON.parse") }) }();

function test(tets1, test2, output, num) {
    var doc = app.activeDocument;
    var namef = doc.name.toString().replace(/\.[^\.]+$/gim, '');
    var fileExtension = doc.fullName.name.match(/\.[^\.]+$/);
    var jpgMain = doc.duplicate(namef + "-" + num);
    var decodedURL = decodeURL(tets1);
    var pathFolderOutput = decodeURL(output);
    selectedLayer("QR");
    app.runMenuItem(stringIDToTypeID('placedLayerEditContents'));
    placeImgFrame(decodedURL, 100);
    app.activeDocument.close(SaveOptions.SAVECHANGES);
    selectedLayer("Text");
    createLayerTexxt(test2)
    flattenImage();
    convertBackgroundToNormalLayer();
    // alert(pathFolderOutput)
    saveTIFF(pathFolderOutput + "/" + namef + "-" + num)
    jpgMain.close(SaveOptions.DONOTSAVECHANGES);
}


function takeSnapshot(name) {
    var desc = new ActionDescriptor();
    var sref = new ActionReference();
    sref.putClass(charIDToTypeID("SnpS"));
    desc.putReference(charIDToTypeID("null"), sref);
    var fref = new ActionReference();
    fref.putProperty(charIDToTypeID("HstS"), charIDToTypeID("CrnH"));
    desc.putReference(charIDToTypeID("From"), fref);
    if (name) {
        desc.putString(charIDToTypeID("Nm  "), name);
    }
    executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
}
function removeNamedSnapshot(name) {
    try {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putName(charIDToTypeID('SnpS'), name);
        desc.putReference(charIDToTypeID('null'), ref);
        executeAction(charIDToTypeID('Dlt '), desc, DialogModes.NO);
    } catch (e) { };
}
function selectHistoryName(HistoryStateName) {
    var idslct = charIDToTypeID("slct");
    var desc153 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref123 = new ActionReference();
    var idSnpS = charIDToTypeID("SnpS");
    ref123.putName(idSnpS, HistoryStateName);
    desc153.putReference(idnull, ref123);
    executeAction(idslct, desc153, DialogModes.NO);
}
function fixSnapshot() {
    var doc = app.activeDocument;
    var newLayer = doc.artLayers.add();
    newLayer.remove();
}
function saveTIFF(path) {
    var idsave = charIDToTypeID("save");
    var desc3010 = new ActionDescriptor();
    var idAs = charIDToTypeID("As  ");
    var desc3011 = new ActionDescriptor();
    var idBytO = charIDToTypeID("BytO");
    var idPltf = charIDToTypeID("Pltf");
    var idIBMP = charIDToTypeID("IBMP");
    desc3011.putEnumerated(idBytO, idPltf, idIBMP);
    var idEncd = charIDToTypeID("Encd");
    var idEncd = charIDToTypeID("Encd");
    var idJPEG = charIDToTypeID("JPEG");
    desc3011.putEnumerated(idEncd, idEncd, idJPEG);
    var idEQlt = charIDToTypeID("EQlt");
    desc3011.putInteger(idEQlt, 8);
    var idlayerCompression = stringIDToTypeID("layerCompression");
    var idEncd = charIDToTypeID("Encd");
    var idZpEn = charIDToTypeID("ZpEn");
    desc3011.putEnumerated(idlayerCompression, idEncd, idZpEn);
    var idTIFF = charIDToTypeID("TIFF");
    desc3010.putObject(idAs, idTIFF, desc3011);
    var idIn = charIDToTypeID("In  ");
    desc3010.putPath(idIn, new File(path + ".tif"));
    var idDocI = charIDToTypeID("DocI");
    desc3010.putInteger(idDocI, 345);
    var idLwCs = charIDToTypeID("LwCs");
    desc3010.putBoolean(idLwCs, true);
    var idsaveStage = stringIDToTypeID("saveStage");
    var idsaveStageType = stringIDToTypeID("saveStageType");
    var idsaveSucceeded = stringIDToTypeID("saveSucceeded");
    desc3010.putEnumerated(idsaveStage, idsaveStageType, idsaveSucceeded);
    executeAction(idsave, desc3010, DialogModes.NO);
}
function flattenImage() {
    var idFltI = charIDToTypeID("FltI");
    executeAction(idFltI, undefined, DialogModes.NO);
}
function createLayerTexxt(text) {
    // Lấy layer đang được chọn
    var selectedLayer = app.activeDocument.activeLayer;
    var selectedBounds = selectedLayer.bounds;
    var selectedWidth = selectedBounds[2] - selectedBounds[0];
    var selectedHeight = selectedBounds[3] - selectedBounds[1];

    // Tạo một layer text mới
    var textLayer = app.activeDocument.artLayers.add();
    textLayer.kind = LayerKind.TEXT;
    var textItem = textLayer.textItem;
    textItem.contents = text;

    // Căn giữa text trong layer
    textItem.justification = Justification.CENTER;

    // Điều chỉnh kích thước layer text để phù hợp với kích thước layer đã chọn
    var textBounds = textLayer.bounds;
    var textWidth = textBounds[2] - textBounds[0];
    var textHeight = textBounds[3] - textBounds[1];

    // Tính toán kích thước mới với lề
    var newWidth = selectedWidth - 100; // Trừ 20px cho lề trái và phải
    var newHeight = selectedHeight - 10; // Trừ 10px cho lề trên và dưới

    var scaleX = newWidth / textWidth * 100;
    var scaleY = newHeight / textHeight * 100;
    var scale = Math.min(scaleX, scaleY);

    textLayer.resize(scale, scale, AnchorPosition.MIDDLECENTER);

    // Di chuyển layer text vào giữa layer đang chọn
    var centerX = (selectedBounds[0] + selectedBounds[2]) / 2;
    var centerY = (selectedBounds[1] + selectedBounds[3]) / 2;
    textBounds = textLayer.bounds;
    var offsetX = centerX - (textBounds[0] + textBounds[2]) / 2;
    var offsetY = centerY - (textBounds[1] + textBounds[3]) / 2;
    textLayer.translate(offsetX, offsetY);
}

function convertBackgroundToNormalLayer() {
    // Check if there is a background layer
    if (app.activeDocument.layers[app.activeDocument.layers.length - 1].isBackgroundLayer) {
        // Convert the background layer to a normal layer
        app.activeDocument.activeLayer = app.activeDocument.layers[app.activeDocument.layers.length - 1];
        app.activeDocument.activeLayer.isBackgroundLayer = false;
    }
}
function placeImgFrame(imgPath, num) {
    var idplaceEvent = stringIDToTypeID("placeEvent");
    var desc291 = new ActionDescriptor();
    var idID = stringIDToTypeID("ID");
    desc291.putInteger(idID, 365);
    var idnull = stringIDToTypeID("null");
    desc291.putPath(idnull, new File(imgPath));
    var idlinked = stringIDToTypeID("linked");
    desc291.putBoolean(idlinked, true);
    var idfreeTransformCenterState = stringIDToTypeID("freeTransformCenterState");
    var idquadCenterState = stringIDToTypeID("quadCenterState");
    var idQCSAverage = stringIDToTypeID("QCSAverage");
    desc291.putEnumerated(idfreeTransformCenterState, idquadCenterState, idQCSAverage);
    desc291.putUnitDouble(stringIDToTypeID("width"), stringIDToTypeID("percentUnit"), num);
    desc291.putUnitDouble(stringIDToTypeID("height"), stringIDToTypeID("percentUnit"), num);
    // executeAction(stringIDToTypeID("transform"),desc291,DialogModes.NO);
    var idoffset = stringIDToTypeID("offset");
    var desc292 = new ActionDescriptor();
    var idhorizontal = stringIDToTypeID("horizontal");
    var idpixelsUnit = stringIDToTypeID("pixelsUnit");
    desc292.putUnitDouble(idhorizontal, idpixelsUnit, 0.000000);
    var idvertical = stringIDToTypeID("vertical");
    var idpixelsUnit = stringIDToTypeID("pixelsUnit");
    desc292.putUnitDouble(idvertical, idpixelsUnit, 0.000000);
    var idoffset = stringIDToTypeID("offset");
    desc291.putObject(idoffset, idoffset, desc292);
    var idreplaceLayer = stringIDToTypeID("replaceLayer");
    var desc293 = new ActionDescriptor();
    var idfrom = stringIDToTypeID("from");
    var ref9 = new ActionReference();
    var idlayer = stringIDToTypeID("layer");
    ref9.putIdentifier(idlayer, 359);
    desc293.putReference(idfrom, ref9);
    var idto = stringIDToTypeID("to");
    var ref10 = new ActionReference();
    var idlayer = stringIDToTypeID("layer");
    ref10.putIdentifier(idlayer, 365);
    desc293.putReference(idto, ref10);
    var idplaceEvent = stringIDToTypeID("placeEvent");
    desc291.putObject(idreplaceLayer, idplaceEvent, desc293);
    executeAction(idplaceEvent, desc291, DialogModes.NO);
}

function selectedLayer(LayerName) {
    try {
        var id239 = charIDToTypeID("slct");
        var desc45 = new ActionDescriptor();
        var id240 = charIDToTypeID("null");
        var ref43 = new ActionReference();
        var id241 = charIDToTypeID("Lyr ");
        if (typeof LayerName == "number") ref43.putIndex(id241, LayerName);
        else ref43.putName(id241, LayerName);
        desc45.putReference(id240, ref43);
        var id242 = charIDToTypeID("MkVs");
        desc45.putBoolean(id242, false);
        executeAction(id239, desc45, DialogModes.NO);
        return true;
    }
    catch (e) { return false; }
}
// Hàm giải mã URL
function decodeURL(url) {
    try {
        return decodeURIComponent(url);
    } catch (e) {
        // Nếu có lỗi, trả về URL gốc
        return url;
    }
}

function osCheck() {
    var os = $.os;
    var match = os.indexOf("Windows");
    if (match != (-1)) {
        var userOS = "PC";
    } else {
        var userOS = "MAC";
    }
    return userOS;
}