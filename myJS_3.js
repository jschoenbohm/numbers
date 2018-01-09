/*!
 \file      myJS_3.js
 \author    J. Schönbohm
 \par Erstellt am:
            2017-10-21

 \version   1.0.0 <b>Datum:</b> 2017-10-21
 \brief     Funktionen für die Zahlenumrechnung
	
\details	Rechnet zwischen reellen Zahlen in der Basis 10 und
          der Darstellung im Format IEEE754 um.
					
*/

// Globale Variablen
var MAX_DIGITS = 32; //<! Maximale Anzahl von Stellen
var MAX_BIAS = 32;  //<! Maximaler Wert für den Bias

/*! \fn formNegativTen2Two()
    \brief Erstellt das Formular für die Zahleneingabe.
*/
function formIEEE() {
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



/*! \fn calc()
    \brief Umrechnung von Basis 10 in Zweierkomplement und Exzessdarstellung.
    \detail Liest die Formularfelder aus und initiiert die Berechnung. Anschließend 
      werden die Ergebnisse eingetragen.
*/
function calc(){
  var num = document.getElementById("number_1").value;
  var digits = document.getElementById("digits").value;
  var bias = document.getElementById("bias").value;
  num = parseInt(num.trim(),10);
  digits = parseInt(digits.trim(),10);
  bias = parseInt(bias.trim(),10);
  // Überprüfung der Eingabe
  var msg = "";
  if(2 > digits || MAX_DIGITS < digits) msg = msg + "Falscher Wert für die Stellenzahl!\n";
  if(0 > bias || Math.pow(2,digits) < bias) msg = msg + "Falscher Wert für den Bias Wert!\n";
  if(-Math.pow(2,digits-1) > num || (Math.pow(2,digits-1)-1) < num) msg = msg + "Zahl und Stellenzahl ergeben keine gültige Kombination! -2^(s-1) <= zahl <= 2^(s-1)-1\n";
  if(0 > bias + num ) msg = msg + "Unzulässige Kombination aus Zahl und Bias! Die Summe muss >= 0 sein!\n";
  if(Math.pow(2,digits)-1 < bias + num ) msg = msg + "Unzulässige Kombination aus Zahl, Bias und Stellenzahl! (Zahl+Bias) < 2^Stellenzahl sein!\n";
  
  if("" !== msg){
    alert(msg);
    return;
  }
  
  // Ergebnis eintragen
  document.getElementById("number_2").value = calcTen2Ex(bias, num);
  document.getElementById("number_3").value = calcTen2Zw(digits, num);
};


