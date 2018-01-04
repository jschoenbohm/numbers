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

var map={"0":0, "1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "A":10, "B":11, "C":12, "D":13, "E":14, "F":15};

/*
  \brief  Initialisiert die Webseite mit der Navigationsleiste
*/
function init()
{
  var out = '\
    <input type="button" value="Umrechnung B1 -> B2" onclick="formB2B()" />\
    <input type="button" value="Ganze Zahl B10 -> B2" onclick="formNegativTen2Two()" />';
  document.getElementById("navbar").innerHTML = out;
  formB2B();
}

function formNegativTen2Two() {
  var comment = '<h2>Geben Sie im grünen Feld die umzurechnende Zahl ein. \
    </h2>';
  var partBaseText = 'min="2" max="16" pattern="[2-9]|1[0-6]" size="2" />';
  
  var inputText = '<label for="base_1">Basis</label>\
    <input type="number" id="base_1" name="base_1" value="2" ' + partBaseText +
    '<label for="number_1">Zahl</label>\
    <input type="text" id="number_1" name="number_1" value="0" />\
    <input type="button" id="bt_calc" name="bt_calc" onclick="calcNatural()" value="Umrechnen" />';
  var outputText = '<label for="base_2">Basis</label>\
    <input type="number" id="base_2" name="base_2" value="10" ' + partBaseText + 
    '<label for="number_2">Zahl</label>\
    <input type="text" id="number_2" name="number_2" readonly="true" value="0"/>';
  document.getElementById("s1").innerHTML = comment;
  document.getElementById("s2").innerHTML = inputText;
  document.getElementById("s3").innerHTML = outputText;
};

function formB2B() {
  var comment = '<h2>Geben Sie im grünen Feld die Ausgangsbasis und die umzurechnende Zahl ein. \
    Im roten Feld geben Sie die Zielbasis ein. Drücken Sie auf \"Umrechen\". Dann erscheint im roten Feld\
    die umgerechnete Zahl.</h2>';
  var partBaseText = 'min="2" max="16" pattern="[2-9]|1[0-6]" size="2" />';
  
  var inputText = '<label for="base_1">Basis</label>\
    <input type="number" id="base_1" name="base_1" value="2" ' + partBaseText +
    '<label for="number_1">Zahl</label>\
    <input type="text" id="number_1" name="number_1" value="0" />\
    <input type="button" id="bt_calc" name="bt_calc" onclick="calcNatural()" value="Umrechnen" />';
  var outputText = '<label for="base_2">Basis</label>\
    <input type="number" id="base_2" name="base_2" value="10" ' + partBaseText + 
    '<label for="number_2">Zahl</label>\
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
  var c;
  for(var i = 0; i < z1.length; ++i){
    c = map[z1.charAt(i)];
    if( c >= b1 || undefined === c ){ 
      msg = msg + "Falscher Wert in Zahl 1: " + z1.charAt(i) + " !\n";
      break;
    }
  }
    
  if("" !== msg) {
    alert(msg);
    return false;
  }
  /*Umrechnung*/
  alert("Die Umrechnung erfolgt bald!");
  /*Ausgabe*/
};

