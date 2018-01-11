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


/*! \fn formIEEE754()
    \brief Erstellt das Formular für die Zahleneingabe.
*/
function formIEEE754() {
  var comment = '<h2>Geben Sie die umzurechnende Zahl, die Anzahl \
  der Bits für die Charakteristik und die Mantisse ein. Anschließend \
  drücken Sie auf die Berechnen-Schaltfläche neben der Zahl. \
  Alternativ können Sie die Auswahlboxen anklicken, um die Zahl zu verändern.\
    </h2>';
  var partBaseText = 'min="2" max="'+B_MAX+'" pattern="[2-9]|1[0-9]" size="2" />';
  
  var inputText_B10 = 
    '<h3>Zahl zur Basis 10</h3>' +
    '<label for="number_ie10">Zahl</label>\
    <input type="text" id="number_ie10" name="number_ie10" value="0" pattern="-[0-9]+|[0-9]+" />\
    <input type="button" id="bt_calc_ie10" name="bt_calc_ie10" onclick="calcTen2IEEE()" value="Berechnen" />';
    
  var inputText_B2a =
    '<label for="bit_char">Bits Charakteristik</label>\
    <input type="text" id="bit_char" name="bit_char" onchange="drawIEEE()" value="8"\
    min="2" max="11" pattern="[2-9]|1[0-1]" size="2"/>' +
    '<label for="bit_mant" style="margin-left:5px;">Bits Mantisse</label>\
    <input type="text" id="bit_mant" name="bit_mant" onchange="drawIEEE()" value="23"\
    min="2" max="52" pattern="[2-9]|[1-4][0-9]|5[0-1]" size="2"/>';

  document.getElementById("s4").style.visibility = "visible";
  document.getElementById("s1").innerHTML = comment;
  document.getElementById("s2").innerHTML = inputText_B10;
  document.getElementById("s3").innerHTML = inputText_B2a;
  drawIEEE();
};

/*! \fn drawIEEE()
    \brief Erstellt das Feld mit den Checkboxen.
*/
function drawIEEE()
{
  var bits_c = document.getElementById("bit_char").value;
  var bits_m = document.getElementById("bit_mant").value;
  var inputText_B2 = 
    '<h3>Bitdarstellung in Anlehnung an IEEE 754</h3>' +
    '<label for="number_2">Zahl</label>' +
    '<input type="checkbox" id="check_v" class="checkIEEE" name="check_v" onchange="calcIEEE2Ten()" visibility="visible" status="unchecked"/> | ' +  generateCheckboxes("c", bits_c) + ' | ' + generateCheckboxes("m", bits_m);
    document.getElementById("s4").innerHTML = inputText_B2;
    calcTen2IEEE(); // Zustand aktualisieren
}

/*! \fn generateCheckboxes(type, bits)
    \brief  Erzeugt die Checkboxen für die Charakteristik oder die Mantisse.
    \param  type  "m" für die Mantisse und "c" für die Charakteristik.
    \param  bits  Anzahl der erforderlichen Checkboxen.
    \return String mit dem erzeugenden HTML-Code
*/
function generateCheckboxes(type, bits){
    var i;
    var str="";
    for(i=0; i<bits; ++i){
      str = str + 
      '<input type="checkbox" id="check_"' + type + i +
      ' class="checkIEEE" name="check_"' + type + i +
      ' onchange="calcIEEE2Ten()" visibility="visible" status="unchecked"/>';
    }
    return str;
}

/*! \fn calcIEEE2Ten()
    \brief Umrechnung IEEE 754 in Basis 10.
    \detail Liest die Formularfelder aus und initiiert die Berechnung. Anschließend 
      werden die Ergebnisse eingetragen.
*/
function calcIEEE2Ten()
{
  alert("called");
}

/*! \fn calcTen2IEEE()
    \brief Umrechnung von Basis 10 in IEEE754.
    \detail Liest die Formularfelder aus und initiiert die Berechnung. Anschließend 
      werden die Ergebnisse eingetragen.
*/
function calcTen2IEEE(){
  var bits_c = document.getElementById("bit_char").value;
  var bits_m = document.getElementById("bit_mant").value;
  var num = document.getElementById("number_ie10").value;
  alert("C: " + bits_c + " M: " + bits_m + " Z: " + num);
};


