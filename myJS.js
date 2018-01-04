/*!
 \file      myJS.js
 \author    J. Schönbohm
 \par Erstellt am:
            2017-10-21

 \version   1.0.0 <b>Datum:</b> 2017-10-21
 \brief     Funktionen für die Zahlenumrechnung
	
\details	
					
*/
"use strict";

function start() {
var comment = '<h2>Geben Sie im grünen Feld die Ausgangsbasis und die umzurechnende Zahl ein. \
  Im roten Feld geben Sie die Zielbasis ein. Drücken Sie auf \"Umrechen\". Dann erscheint im roten Feld\
  die umgerechnete Zahl.</h2>';
  var inputText = '<label for="base_1">Basis</label>\
    <input type="number" id="base_1" name="base_1" value="2" min="2" max="16"\
    pattern="[2-9]|1[0-6]" />\
    <label for="number_1">Zahl</label>\
    <input type="text" id="number_1" name="number_1" value="0" />\
    <input type="button" id="bt_calc" name="bt_calc" onclick="calcNatural()" value="Umrechnen" />';
  var outputText = '<label for="base_2">Basis</label>\
    <input type="number" id="base_2" name="base_2" value="10" min="2" max="16"\
    pattern="[2-9]|1[0-6]"/>\
    <label for="number_2">Zahl</label>\
    <input type="text" id="number_2" name="number_2" readonly="true" value="0"/>';
  document.getElementById("s1").innerHTML = comment;
  document.getElementById("s2").innerHTML = inputText;
  document.getElementById("s3").innerHTML = outputText;
};

function calcNatural()
{
  var b1 = document.getElementById("base_1").value;
  var z1 = document.getElementById("number_1").value;
  var b2 = document.getElementById("base_2").value;
  var z2 = document.getElementById("number_2").value;
  var msg = "";
  /*Eingabeüberprüfung*/
  if(2>b1|| 16 < b1) msg = "Fehler Basis 1 ist falsch!\n";
  if(2>b2|| 16 < b2) msg = msg + "Fehler Basis 2 ist falsch!\n";
  if(2>b1|| 16 < b1) msg = msg + "";
  if("" !== msg) {
    alert(msg);
    return false;
  }
  /*Umrechnung*/
  
  /*Ausgabe*/
};

