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
  
  var inputText_B10 = 
    '<h3>Zahl zur Basis 10</h3>' +
    '<label for="number_ie10">Zahl</label>\
    <input type="text" id="number_ie10" name="number_ie10" value="0" style="padding-left:5px;" size="25"/>\
    <input type="button" id="bt_calc_ie10" name="bt_calc_ie10" onclick="calcTen2IEEE()" value="Berechnen" style="margin-right:10px;" />'+
    '<b id="denorm" name="denorm" style="visibility:hidden;"><b>denormalisiert</b></b>';
    
  var inputText_B2a =
    '<label for="bit_char">Bits Charakteristik</label>\
    <input type="text" id="bit_char" name="bit_char" onchange="drawIEEE()" value="8"\
    min="2" max="11" pattern="[2-9]|1[0-1]" size="2" style="padding-left:5px;"/>' +
    '<label for="bit_mant" style="margin-left:5px;">Bits Mantisse</label>\
    <input type="text" id="bit_mant" name="bit_mant" onchange="drawIEEE()" value="23"\
    min="2" max="52" pattern="[2-9]|[1-4][0-9]|5[0-1]" size="2" style="padding-left:5px;"/>' +
    '<label for="bias_ie" style="margin-left:5px;">Bias</label>\
    <input type="text" id="bias_ie" name="bias_ie" style="background-color:LightGray; padding-left:5px;" size="3" readonly/>'+
    '<input type="text" id="bit_char_h" name="bit_char_h" style="visibility:hidden;" value="8" readonly/>'+
    '<input type="text" id="bit_mant_h" name="bit_mant_h" style="visibility:hidden;" value="23" readonly/>';

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
  var err="";
  var bits_c = document.getElementById("bit_char").value;
  
  if(2 > bits_c || bits_c > 11){
    err = err + "Die Anzahl der Bits für die Charakteristik ist nicht zulässig. Wählen Sie einen Wert aus dem Intervall von 2 bis 11.\n";
  }
  var bits_m = document.getElementById("bit_mant").value;
  if(2 > bits_m || bits_m > 52){
    err = err + "Die Anzahl der Mantissenbits ist nicht zulässig. Wählen Sie einen Wert aus dem Intervall von 2 bis 52.\n";
  }
  if(err !== "" ){
    alert(err);
    // vorherige, gültige Werte, die zum restlichen Zustand passen wieder eintragen
    document.getElementById("bit_char").value = document.getElementById("bit_char_h").value;
    document.getElementById("bit_mant").value = document.getElementById("bit_mant_h").value;
    return;
  }
  
  var inputText_B2 = 
    '<h3>Bitdarstellung in Anlehnung an IEEE 754</h3>' +
    '<label for="number_2">Zahl</label>' +
    '<input type="checkbox" id="check_v" class="checkIEEE" name="check_v" onchange="calcIEEE2Ten()"/> | ' +  generateCheckboxes("c", bits_c) + ' | ' + generateCheckboxes("m", bits_m);
    document.getElementById("s4").innerHTML = inputText_B2;
    document.getElementById("bias_ie").value = Math.pow(2,bits_c-1)-1;
    document.getElementById("bit_char_h").value = bits_c;
    document.getElementById("bit_mant_h").value = bits_m;
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
      '<input type="checkbox" id="check_' + type + i + '"' +
      ' class="checkIEEE" name="check_' + type + i + '"' +
      ' onchange="calcIEEE2Ten()" ';
      if((i+1)%4===0) str = str + 'style="margin-right:15px;" ';
      str = str + '/>';
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
  var bits_c = document.getElementById("bit_char").value;
  var bits_m = document.getElementById("bit_mant").value;
  var bias = document.getElementById("bias_ie").value;
  // Vorzeichen
  var sign;
  if(document.getElementById("check_v").checked===true) sign = -1;
  else sign = 1;
  
  // Charakteristik
  var id_temp="check_c";
  var id;
  var expo = 0;
  var faktor = 1;
  var infNaN = false;  // Charakteristik voll
  var denorm = false;  // Charakteristik leer
  for(var i = bits_c - 1; i >= 0; --i){
    id = id_temp + i;
    if(document.getElementById(id).checked === true ){
      expo = expo + faktor;
    }
    faktor = faktor * 2;
  }
  // Auf spezielle Charakteristiken prüfen
  if(expo === 0) denorm = true;
  if(expo === Math.pow(2,bits_c)-1)infNaN = true;
   
  // Mantisse
  var num;
  faktor = 2;
  id_temp = "check_m";
  if(denorm === true || infNaN === true) num = 0;
  else num = 1;
  
  for(var i = 0; i < bits_m; ++i){
    id = id_temp + i;
    if(document.getElementById(id).checked === true ){
      num = num + 1.0 / faktor;
    }
    faktor = faktor * 2;
  } 
  
  if(denorm === true && num === 0)
  { // Wert ist 0
    document.getElementById("number_ie10").value = "0";
  }
  else{
    if(infNaN === true && num === 0){ // Infinitiy
      if(sign === 1)
        document.getElementById("number_ie10").value = "+ Infinity";
      else
        document.getElementById("number_ie10").value = "- Infinity";
    }
    else
    {
      if(infNaN === true && num !== 0){ // NaN
        document.getElementById("number_ie10").value = "NaN";
      }
      else{
        if(denorm === true)
        { // denormalisierte Zahl
          document.getElementById("number_ie10").value = (sign * num * Math.pow(2, 1-bias)).toString();
          document.getElementById("denorm").style.visibility = "visible";
        }
        else
        { // reelle Zahl ohne Besonderheiten
          document.getElementById("number_ie10").value = (sign * num * Math.pow(2, (expo-bias))).toString();
          document.getElementById("denorm").style.visibility = "hidden";
        }
      }
    }
  }
}

/*! \fn calcTen2IEEE()
    \brief Umrechnung von Basis 10 in IEEE754.
    \detail Liest die Formularfelder aus und initiiert die Berechnung. Anschließend 
      werden die Ergebnisse eingetragen.
*/
function calcTen2IEEE(){
  var bits_c = document.getElementById("bit_char").value;
  var bits_m = document.getElementById("bit_mant").value;
  var bias = document.getElementById("bias_ie").value;
  var num = document.getElementById("number_ie10").value;
  var vor, nach;
  // Eingabekontrolle
  
  // Vorzeichen
  var sign;
  if(num*1.0 > 0){
    sign = 1;
    num = num * 1.0;
  }
  else{
    sign = -1;
    num = num * -1.0;
  }

  vor = Math.floor(num);
  nach = num - vor;
  
  var expo = calcTen2B("2", vor.toString());
  // expo.length = Anzahl Stellen n -> n-1 = Exponent
  
  var char_str = calcTen2Ex(bias, vor);
  alert("Char: " + char_str);
  /*alert("C: " + bits_c + " M: " + bits_m + " Z: " + num);
  
  if(
  document.getElementById("check_v").checked  === true){
    document.getElementById("check_v").checked = false;
  }else{
    document.getElementById("check_v").checked = true;
  }
  */
};


