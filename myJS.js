/*!
 \file      myJS.js
 \author    J. Schönbohm
 \par Erstellt am:
            2017-10-21

 \version   1.0.0 <b>Datum:</b> 2017-10-21
 \brief     Funktionen für die Zahlenumrechnung
	
\details	Rechnet Festkommazahlen von einer Basis in eine zweite Basis um.
					
*/
"use strict";

// Globale Variablen
var map={"0":0, "1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "A":10, "B":11, "C":12, "D":13, "E":14, "F":15, "G":17,"H":18,"I":19};
var remap=["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I"];
var B_MAX = 19; //<! Maximal erlaubte Basis

/*! \fn init()
    \brief  Initialisiert die Webseite mit der Navigationsleiste
*/
function init()
{
  var out = '\
    <input type="button" value="Umrechnung B1 -> B2" onclick="formB2B()" />\
    <input type="button" value="Ganze Zahl B10 <-> B2" onclick="formNegativTen2Two()" />\
    <input type="button" value="IEEE 754" onclick="formIEEE754()" />';
  document.getElementById("navbar").innerHTML = out;
  formB2B();
}

/*! \fn formB2B()()
    \brief Erstellt das Formular für die Zahleneingabe.
*/
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

/*! \fn calcB2B()
    \brief Umrechnung von Basis B1 in Basis B2.
    \detail Liest die Formularfelder aus und initiiert die Berechnung. Anschließend 
      werden die Ergebnisse eingetragen.
*/
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
  var num_b2 = calcTen2B(b2,res);
  var pos_d = num_b2.search(/\./);
  if(pos_d >= 0)
    num_b2 = num_b2.substring(0,pos_d + 16);
  document.getElementById("number_2").value= num_b2;
};

/*! \fn string calcB2Ten(B, num)
    \brief Umrechnung von Basis B in Basis 10.
    \param  B   string, Basis, in der num angegeben ist.
    \param  num string, Zahl, die umgerechnet werden soll.
    \return string  Zahl in der Basis 10.
*/
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

/*! \fn string calcTen2B(B, num)
    \brief Umrechnung von Basis 10 in Basis B.
    \param  B   string, Basis, in die \a num umgerechnet werden soll.
    \param  num string, Zahl, die umgerechnet werden soll.
    \return string  Zahl in der Basis B.
*/
function calcTen2B(B, num){
  if("10" === B || "0" === num) return num;
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
  while(r1 !== 0 && b1 <= 53){
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
