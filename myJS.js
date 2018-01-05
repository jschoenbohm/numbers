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

var map={"0":0, "1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "A":10, "B":11, "C":12, "D":13, "E":14, "F":15, "G":17,"H":18,"I":19};
var remap=["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I"];
var B_MAX = 19;
/*
  \brief  Initialisiert die Webseite mit der Navigationsleiste
*/
function init()
{
  var out = '\
    <input type="button" value="Umrechnung B1 -> B2" onclick="formB2B()" />\
    <input type="button" value="Ganze Zahl B10 <-> B2" onclick="formNegativTen2Two()" />';
  document.getElementById("navbar").innerHTML = out;
  formB2B();
}

function formNegativTen2Two() {
  var comment = '<h2>Geben Sie die umzurechnende Zahl, die Stellenzahl und den Bias-Wert ein. \
    Anschließend drücken Sie auf die Berechnen-Schaltfläche neben der Zahl.\
    </h2>';
  var partBaseText = 'min="2" max="'+B_MAX+'" pattern="[2-9]|1[0-9]" size="2" />';
  
  var inputText_B10 = 
    '<h3>Zahl zur Basis 10</h3>' +
    '<label for="number_1">Zahl</label>\
    <input type="text" id="number_1" name="number_1" value="0" pattern="-[0-9]+|[0-9]+" />\
    <input type="button" id="bt_calc_1" name="bt_calc_1" onclick="calcTen2ExZw()" value="Berechnen" />';
    
  var inputText_B2a =
    '<label for="digits">Stellenzahl</label>\
    <input type="text" id="digits" name="digits" value="8"\
    min="2" max="64" pattern="[2-9]|[1-5][0-9]|6[0-4]" size="2"/>' +
    '<label for="bias" style="margin-left:5px;">Bias</label>\
    <input type="text" id="bias" name="bias" value="4"\
    min="0" max="128" pattern="[0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]" size="3"/>';
  
  var inputText_B2 = 
    '<h3>Zahlen zur Basis 2</h3>' +
    '<h4>Exzessdarstellung</h4>' +
    '<label for="number_2">Zahl</label>\
    <input type="text" id="number_2" name="number_2" value="0" pattern="-[0-1]+|[0-1]+"/>' + 
    '<input type="button" id="bt_calc_2" name="bt_calc_2" onclick="calcEx2ZwTen()" value="Berechnen" />' +
    '<h4>Zweierkomplement</h4>' +
    '<label for="number_3">Zahl</label>\
    <input type="text" id="number_3" name="number_3" value="0" pattern="-[0-1]+|[0-1]+"/>' +
    '<input type="button" id="bt_calc_3" name="bt_calc_3" onclick="calcZw2ExTen()" value="Berechnen" />'
    ;
  document.getElementById("s4").style.visibility = "visible";
  document.getElementById("s1").innerHTML = comment;
  document.getElementById("s2").innerHTML = inputText_B10;
  document.getElementById("s3").innerHTML = inputText_B2a;
  document.getElementById("s4").innerHTML = inputText_B2;
};
var MAX_DIGITS = 64;
var MAX_BIAS = 64;
// Ganze Zahl zur Basis 10 in Zweierkomplement und Exzessdarstellung umrechnen
function calcTen2ExZw(){
  var num = document.getElementById("number_1").value;
  var digits = document.getElementById("digits").value;
  var bias = document.getElementById("bias").value;
  num = num.trim();
  digits = digits.trim();
  bias = bias.trim();
  // Überprüfung der Eingabe
  var msg = "";
  if(1 > digits || MAX_DIGITS < digits) msg = msg + "Falscher Wert für die Stellenzahl!\n";
  if(0 > bias || MAX_BIAS < bias) msg = msg + "Falscher Wert für den Bias Wert!\n";
  
  if("" !== msg){
    alert(msg);
    return;
  }
  
  // Ergebnis eintragen
  document.getElementById("number_2").value = calcTen2Ex(digits, bias, num);
  document.getElementById("number_3").value = calcTen2Zw(digits, num);
};
// Dualzahl in der Exzessdarstellung in Zahl zur Basis 10 und in Zweierkomplement umrechnen
function calcEx2ZwTen(){
  var num = document.getElementById("number_2").value;
  var digits = document.getElementById("digits").value;
  var bias = document.getElementById("bias").value;
  // Überprüfung der Eingabe
  
  // Ergebnis eintragen
  var num = calcEx2Ten(digits, bias, num);
  document.getElementById("number_1").value = num;  
  document.getElementById("number_3").value = calcTen2Zw(digits, num);  
};
// Dualahl im Zweierkomplement in Zahl zur Basis 10 und in die Exzessdarstellung umrechnen
function calcZw2ExTen(){
  var num = document.getElementById("number_3").value;
  var digits = document.getElementById("digits").value;
  var bias = document.getElementById("bias").value;
  // Überprüfung der Eingabe
  
  // Ergebnis eintragen
  var num = calcZw2Ten(digits, num);
  document.getElementById("number_1").value = num;
  document.getElementById("number_2").value = calcTen2Ex(digits, bias, num);
  
};


// Ganze Zahl zur Basis 10 in Zweierkomplement umrechnen
function calcTen2Zw(digits, num){
  var result = "0";
  return result;  
};

// Ganze Zahl zur Basis 10 in Exzessdarstellung umrechnen
function calcTen2Ex(digits, bias, num){
  var result = "1";
  return result; 
};

// Zahl aus der Exzessdarstellung umrechnen in Basis 10 
function calcEx2Ten(digits, bias, num){
  var result = "2";
  return result;  
};

// Zahl aus dem Zweierkomplement umrechen in die Basis 10
function calcZw2Ten(digits, num){
  var result = "3";
  return result;
};

// Funktionen zur Umrechnung von Basis B1 in Basis B2 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function formB2B() {
  var comment = '<h2>Geben Sie im grünen Feld die Ausgangsbasis [2-'+B_MAX+'] und die umzurechnende Dezimalzahl ein. \
    Im roten Feld geben Sie die Zielbasis [2-'+B_MAX+'] ein. Drücken Sie auf \"Umrechen\". Dann erscheint im roten Feld\
    die umgerechnete Zahl.</h2>';
  var partBaseText = 'min="2" max="'+B_MAX+'" pattern="[2-9]|1[0-9]" size="2" />';
  
  var inputText = '<label for="base_1">Basis</label>\
    <input type="number" id="base_1" name="base_1" value="2" ' + partBaseText +
    '<label for="number_1">Zahl</label>\
    <input type="text" id="number_1" name="number_1" value="0" />\
    <input type="button" id="bt_calc" name="bt_calc" onclick="calcB2B()" value="Umrechnen" />';
  var outputText = '<label for="base_2">Basis</label>\
    <input type="number" id="base_2" name="base_2" value="10" ' + partBaseText + 
    '<label for="number_2">Zahl</label>\
    <input type="text" id="number_2" name="number_2" readonly="true" value="0"/>';
  document.getElementById("s1").innerHTML = comment;
  document.getElementById("s2").innerHTML = inputText;
  document.getElementById("s3").innerHTML = outputText;
  document.getElementById("s4").style.visibility = "hidden";
};

function calcB2B(){
  var b1 = document.getElementById("base_1").value;
  var z1 = document.getElementById("number_1").value;
  var b2 = document.getElementById("base_2").value;
  z1 = z1.trim(); // Entferne Leerzeichen am Anfang und Ende.
  var msg = "";
  var dot = false;
  /*Eingabeüberprüfung*/
  if(2>b1|| B_MAX < b1) msg = "Fehler Basis 1 ist falsch!\n";
  if(2>b2|| B_MAX < b2) msg = msg + "Fehler Basis 2 ist falsch!\n";
  var c, ii; // Hilfsvariablen
  
  // Vorzeichen und Dezimalpunkt berücksichtigen
  if(z1.charAt(0) === '-' || z1.charAt(0) === '+' ) ii = 1;
  else ii = 0;
  for(var i = ii; i < z1.length; ++i){
    if(z1.charAt(i) === '.'){
      if(dot === false){
        dot = true;
        continue;
      } // Falls mehrere Punkte enthalten sind, wird die nächste if-Anweisung die Fehlermeldung auslösen.
    }
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
  var res = calcB2Ten(b1,z1);
  document.getElementById("number_2").value= calcTen2B(b2,res);
  /*Ausgabe*/
};

function calcB2Ten(B, num){
  if("10" === B) return num;
  var unum = num; // Vorzeichenlose Zahl
  var dot;        // Position des Dezimaltrennzeichens
  var vor, nach;  // Vor- und Nachkommaanteil
  var result;     // Speichert die umgerechnete Zahl
  var r1, r2, b1; // Hilfsvariablen
  B = 1 * B;      // Konvertierung in eine Zahl
  // Entfernt das Vorzeichen
  if("+" === num.charAt(0) || "-" === num.charAt(0))
     unum = num.substring(1, num.length);
   
  // In Vor- und Nachkommaanteil aufteilen
  dot = unum.search(/\./);
  if(-1 === dot){
    vor = unum;
    nach = "";
  }
  else {
    vor = unum.substring(0,dot);
    nach = unum.substring(dot+1, unum.length);
  }
  // Umrechnug des Vorkommaanteils
  r1 = 0;
  b1 = 1.0;
  for(var i = vor.length-1; i >= 0 ; --i){
    r1 = r1 + b1 * map[vor.charAt(i)];
    b1 = b1 * B;
  }
  // Umrechnug des Nachkommaanteils
  r2 = 0;
  b1 = 1.0/B;
  for(var i = 0; i < nach.length; ++i){
    r2 = r2 + b1 * map[nach.charAt(i)];
    b1 = b1 / B;
  }
  if(num.charAt(0) === "-")
    result = "-";
  else
    result = "";
  result = result.concat(r1.toString());
  if(0 < r2)
    result = result.concat((r2.toString()).substring(1,(r2.toString()).length));
  return result;
}

function calcTen2B(B, num){
  if("10" === B) return num;
  var unum = num; // Vorzeichenlose Zahl
  var dot;        // Position des Dezimaltrennzeichens
  var vor, nach;  // Vor- und Nachkommaanteil
  var result = "";     // Speichert die umgerechnete Zahl
  var r1, r2, b1; // Hilfsvariablen
  B = 1 * B;      // Konvertierung in eine Zahl
  // Entfernt das Vorzeichen
  if("+" === num.charAt(0) || "-" === num.charAt(0))
     unum = num.substring(1, num.length);
   
  // In Vor- und Nachkommaanteil aufteilen
  dot = unum.search(/\./);
  if(-1 === dot){
    vor = 1 * unum;
    nach = 0;
  }
  else {
    vor = 1 * (unum.substring(0,dot));
    nach = 1 * (unum.substring(dot, unum.length));
  }
  // Umrechnug des Vorkommaanteils
  while(vor !== 0){
    r1 = vor % B;
    vor = Math.floor(vor/B);
    result = (remap[r1]).concat(result);
  }
  if(-1 !== dot){
    result = result.concat(".");
  }
  // Umrechnug des Nachkommaanteils
  b1 = 0; // Stellenzähler, es werden max. 16 Nachkommastellen ausgegeben! 
  r1 = nach;
  while(r1 !== 0 && b1 <= 16){
    r1 = r1 * B;
    r2 = Math.floor(r1);
    r1 = r1 - r2;
    result = result.concat(remap[r2]);
    ++b1;
  } 
  if(num.charAt(0) === "-")
    result = ("-").concat(result);

  return result;
}
