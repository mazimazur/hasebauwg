/**
* Retrieves all the rows in the active spreadsheet that contain data and logs the
* values for each row.
* For more information on using the Spreadsheet API, see
* https://developers.google.com/apps-script/service_spreadsheet
*/
function readRows() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  
  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    Logger.log(row);
  }
};

/**
* Adds a custom menu to the active spreadsheet, containing a single menu item
* for invoking the readRows() function specified above.
* The onOpen() function, when defined, is automatically invoked whenever the
* spreadsheet is opened.
* For more information on using the Spreadsheet API, see
* https://developers.google.com/apps-script/service_spreadsheet
*/
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Read Data",
    functionName : "readRows"
  }];
  spreadsheet.addMenu("Script Center Menu", entries);
};

function countSummeEinkaufszettel(i, j, k) {
  /**
  method how to sum array-values
  */
  //--> var result =  parseInt(i[0])+parseInt(i[2]);
  var result = 0;
  var y = 500;
  for (var x = 0; x <= y; x++) {
    if( parseFloat(i[x]) == k ){
      result = parseFloat(result)+parseFloat(j[x]);
    }
  }
  
  return result;
}
//i = Einkaufszettelfeld, j = x im Privateinkauf, k = Zahl des Einkaufszettels, l = Wert des Abzuges
function countPrivateinkauf (i,j,k,l){
  var result = 0;
  var y = 500;
  for (var x = 0; x <= y; x++) {
    if( (parseInt(i[x]) == k) && (j[x] == 'x')){
      
      result = parseFloat(result)+parseFloat(l[x]);
    }
  }
  
  return result;
}


function countAktion (i,j,k,l){
  var result = 0;
  var y = 500;
  for (var x = 0; x <= y; x++) {
    if( (parseInt(i[x]) == k) && (j[x] !='')) {
      
      result = parseFloat(result)+parseFloat(l[x]);
    }
  }
  
  return result;
}

function uniqueWarenbezeichnungen(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Einkaufszettel-Erfassung');
  var rangeWarenbezeichnungen =  sheet.getRange("D2:D"+(sheet.getLastRow()-1));
  var values = rangeWarenbezeichnungen.getValues();
  var newArr = new Array();
  var origLen = rangeWarenbezeichnungen.getNumRows();
  var found;
  var x;
  var y;
  
  if(sheet == null){
    return 'Fehler bei der Sheetbezeichnung';
  }
  
  for ( x = 0; x < origLen; x++ ) {
    found = undefined;
    for ( y = 0; y < newArr.length; y++ ) {
      if ( String(values[x]) === String(newArr[y])) { 
        found = true;
        break;
      }
    }
    if ( !found) newArr.push( values[x] );    
  }
  newArr.sort();
  return newArr;
}



function checkForWarenart(){
  
  var sheetWarenbez = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Warenbezeichnungen / Warenart');
  var sheetEink = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Einkaufszettel-Erfassung');
  
  var rangeWarenbez = sheetWarenbez.getRange("A2:A"+(sheetWarenbez.getLastRow()));  
  var rangeEink = sheetEink.getRange("D2:D"+(sheetEink.getLastRow()));
  var rangeEinkWarenart = sheetEink.getRange("L2:L"+(sheetEink.getLastRow()));
  
  var warenbezvalues = rangeWarenbez.getValues();
  var einkvalues = rangeEink.getValues();
  var warenartvalues = rangeEinkWarenart.getValues();
  
  
  var newArr = []; 
  var warenbezLen = rangeWarenbez.getNumRows();
  var warenbezalleLen = rangeEink.getNumRows();
  var found;
  
  for(var x = 0; x < warenbezalleLen-1; x++){
    
    found = undefined;
    
    for(var y = 0; y < warenbezalleLen-1; y++){
      
      if( String(warenbezvalues[x]) === String(einkvalues[y]) ) {
        found = true;
        break;
      }
    }
    if(found) newArr.push(warenartvalues[y]);
  }
  return newArr;
}



function countCostPerWarenbez(){
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Einkaufszettel-Erfassung');
  var rangeWarenbez = sheet.getRange("D2:D"+(sheet.getLastRow()));
  var rangeEinkPreis = sheet.getRange("H2:H"+(sheet.getLastRow())); 
  var warenbezalleLen = rangeWarenbez.getNumRows();
  var warenbezalle = rangeWarenbez.getValues();

  var actSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Warenbezeichnungen / Warenart sortiert');
  var rangeWarenUnique = actSheet.getRange("B2:B"+(actSheet.getLastRow()));
  var warenuniqueLen = rangeWarenUnique.getNumRows();
  var warenunique = rangeWarenUnique.getValues();
  
  var kosten = rangeEinkPreis.getValues();
  var found = undefined;
  var newArr = [];
  var sum = 0;
  var tempArr = [];
  
  var resultArr = [];
  
  if(!actSheet || !sheet){
    return 'Tabellenbezeichnungsbezug ist falsch';
  }
  Logger.log(warenbezalle);
  for(var x = 0; x < warenuniqueLen; x++){
    for(var y = 0; y < warenbezalleLen; y++){
      if(String(warenunique[x]) == String(warenbezalle[y])){
         newArr.push(warenunique[x],kosten[y]);
         }
    }
  }
  
  for(var z = 0; z < (newArr.length/2); z=z+2){
    
    if(String(newArr[z+2])  == String(newArr[z])) {
      tempArr.push(newArr[z+3]);
    }
    else if( (String(newArr[z+2])  != String(newArr[z])) && (String(newArr[z-2]) == String(newArr[z])) ){
      tempArr.push(newArr[z+1]);
    }
    
    if((String(newArr[z+2])  != String(newArr[z])) && (String(newArr[z-2]) != String(newArr[z]))) {
      tempArr.push(newArr[z+1])
    }
  }
      for(var a = 0; a < tempArr.length; a++) {
        sum += parseFloat(tempArr[a]);
      }
     //
 Logger.log(tempArr);
      resultArr.push(sum)
      tempArr = [];
      sum = 0;
    
   

   
  
//Logger.log(resultArr);
    
  
                     
  return newArr;
  
}



function f(range)
{
  var r = SpreadsheetApp.getActiveSpreadsheet().getRange(range);
  var aValues = r.getValues();
  
}


/*function copyKnownWarenbezeichnungen(einkaufswarenbezeichnung, warenbezeichnungenbekannt, warengruppenbekannt) {
  //  var knownGroup = new Array();
 // var warenbekanntLen = warenbezeichnungenbekannt.length;
  //  var gruppebekanntLen = warengruppenbekannt.length;
  //  var found;
  var x;
  //  var y;
  
  for ( x = 0; x < warenbekanntLen; x++ ) {
    
    
    if ( String(einkaufswarenbezeichnung) == String(warenbezeichnungenbekannt[x])) { 
      
      return String(warengruppenbekannt[x]);
      
      
    }
    
    
    
    
  }
  return 'Warengruppe definieren';
}
*/

function test(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Einkaufszettel-Erfassung');
  //var sheet = ss.getSheets()['Einkaufszettel-Erfassung'];
  
  // The two samples below produce the same output
  var values = sheet.getSheetValues(1, 1, 50,1 );
  var actCell = sheet.getActiveCell();
  var lastColumn = sheet.getLastRow();
  var cell = sheet.getRange("A1");
  var newCell = cell.offset(1,1);
  var range = sheet.getRange("D2:D"+(sheet.getLastRow()-1));
  // var val = range.getA1Notation();
  var val = range.getNumRows();
  var val2 = range.getValues();
  // var 
  // Logger.log(values);
  return val2[0];
  /*var range = sheet.getRange(1, 1, 3, 3);
  values = range.getValues();
  Logger.log(values);*/
}
