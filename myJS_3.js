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
    <input type="text" id="number_ie10" name="number_ie10" value="0" style="padding-left:5px;" size="25" onclick="this.select()"/>\
    <input type="button" id="bt_calc_ie10" name="bt_calc_ie10" onclick="calcTen2IEEE()" value="Berechnen" style="margin-right:10px;" autofocus/>';
    
  var inputText_B2a =
    '<label for="bit_char">Bits Charakteristik</label>\
    <input type="text" id="bit_char" name="bit_char" onchange="drawIEEE()" value="8"\
    min="2" max="11" pattern="[2-9]|1[0-1]" size="2" style="padding-left:5px;" onclick="this.select()"/>' +
    '<label for="bit_mant" style="margin-left:5px;">Bits Mantisse</label>\
    <input type="text" id="bit_mant" name="bit_mant" onchange="drawIEEE()" value="23"\
    min="2" max="52" pattern="[2-9]|[1-4][0-9]|5[0-1]" size="2" style="padding-left:5px;" onclick="this.select()"/>' +
    '<label for="bias_ie" style="margin-left:5px;">Bias</label>\
    <input type="text" id="bias_ie" name="bias_ie" style="background-color:LightGray; padding-left:5px;" size="3" readonly/>'+
    '<input type="text" id="bit_char_h" name="bit_char_h" style="visibility:hidden;" value="8" readonly/>'+
    '<input type="text" id="bit_mant_h" name="bit_mant_h" style="visibility:hidden;" value="23" readonly/>';

  var inputText_Testfall = 'Charakteristik: 4, Mantisse: 4<p><table>\
  <tr><th>Dezimal</th><th>Dual</th><th>Gerundet</th></tr>\
  <tr><td>252</td> <td>1.1111|1 * 2^7</td><td>Inf</td></tr>\
  <tr><td>0.4921875</td> <td>1.1111|1 * 2^-2</td>  <td>0.5</td></tr>\
  <tr><td>0.3046875</td> <td>1.0011|1 * 2^-2</td> <td>0.3125</td></tr>\
  <tr><td>0.314453125</td> <td>1.0100|0 * 2^-2</td>  <td>0.3125</td></tr>\
  <tr><td>0.00390625</td> <td>0.0100|0 * 2^-6</td> <td>0.00390625</td></tr>\
  <tr><td>0.00537109375</td> <td>0.0101|1 * 2^-6</td>  <td>0.005859375</td></tr>\
  <tr><td>0.0009765625</td> <td>0.0001|0 * 2^-6</td>  <td>0.0009765625</td></tr>\
  </table>';
  document.getElementById("s4").style.visibility = "visible";
  document.getElementById("s1").innerHTML = comment;
  document.getElementById("s2").innerHTML = inputText_B10;
  document.getElementById("s3").innerHTML = inputText_B2a;
  document.getElementById("s5").innerHTML = inputText_Testfall;
  document.getElementById("s5").style.visibility = "visible";
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
    '<input type="checkbox" id="check_v" class="checkIEEE" name="check_v" onchange="calcIEEE2Ten()"/> | ' +  generateCheckboxes("c", bits_c) + ' | ' + generateCheckboxes("m", bits_m)
    +
    '<div style="margin-top:15px;"><label for="number_ie2" >Darstellung als double: </label>' +
    '<i id="number_ie2" name="number_ie2" style="padding-left:10px;padding-right:10px;">0</i>' + 
    '<b id="denorm" name="denorm" style="visibility:hidden;">denormalisiert</b></div>';
    
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
    document.getElementById("number_ie2").innerHTML = "0";
    document.getElementById("denorm").style.visibility = "hidden";
  }
  else{
    if(infNaN === true && num === 0){ // Infinitiy
      if(sign === 1)
        document.getElementById("number_ie2").innerHTML = "+ Infinity";
      else
        document.getElementById("number_ie2").innerHTML = "- Infinity";
      document.getElementById("denorm").style.visibility = "hidden";
    }
    else
    {
      if(infNaN === true && num !== 0){ // NaN
        document.getElementById("number_ie2").innerHTML = "NaN";
        document.getElementById("denorm").style.visibility = "hidden";
      }
      else{
        if(denorm === true)
        { // denormalisierte Zahl
          document.getElementById("number_ie2").innerHTML = (sign * num * Math.pow(2, 1-bias)).toString();
          document.getElementById("denorm").style.visibility = "visible";
        }
        else
        { // reelle Zahl ohne Besonderheiten
          document.getElementById("number_ie2").innerHTML = (sign * num * Math.pow(2, (expo-bias))).toString();
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
  var id_temp;
  var id;
  num = num.trim();
  var sign = 1;
  // Vorzeichen ermitteln und entfernen (log() mit negativer Zahl)
  if(num.charAt(0) === "-"){
    sign = -1;
    num = num.substring(1,num.length);
  }
  if(num.charAt(0) === "+"){
    num = num.substring(1,num.length);
  }

  // Format von num prüfen und in x*2^y umwandeln
  var expo_10 = "";
  var pos_e = num.search(/e/i);
  if(0 <= pos_e){
    expo_10 = parseInt(num.substring(pos_e+1, num.length),10);
    num = parseFloat(num.substring(0,pos_e));
  }
  else{
    expo_10 = 0;
    num = parseFloat(num);
  }
  
  // Die Zahl 0
  if(0 === num){
    id_temp = "check_c";     
    for(var i = 0; i < bits_c; ++i){
      id = id_temp + (bits_c-1-i);
        document.getElementById(id).checked = false;
    }   
    id_temp = "check_m";   
    for(var i = 0; i < bits_m; ++i){
      id = id_temp + (bits_m-1-i);
      document.getElementById(id).checked = false;
    } 
    document.getElementById("number_ie2").innerHTML = "0";
    return;
  } 
  
  var y1 = Math.floor(Math.log(num)/Math.LN2); // Zweierpotenz für die Zahl ohne 10^n
  var y2 = Math.floor(Math.log(Math.pow(10,expo_10))/Math.LN2); // Zweierpotenz von 10^n
  var num1 = num / Math.pow(2,y1);
  var num2 = Math.pow(10,expo_10) / Math.pow(2,y2);
  var expo_2 = y1+y2;
  var num4 = num1;
  
  if(num2 !== 0){
    var num3 = num1 * num2;
    var y3 = Math.floor(Math.log(num3)/Math.LN2);
    num4 = num3 / Math.pow(2,y3);
    expo_2 = expo_2+y3;
  }
  
  var mantisse = calcTen2B("2", num4.toString());
  
  // Mantissenbits zurück setzen
  var id_temp = "check_m";
  for(var i = 0; i < bits_m; ++i){
    id = id_temp + i;
    document.getElementById(id).checked = false;        
  }  
  
  // Spezialfälle vorher abfangen
  bias = parseInt(bias,10);
  bits_c = parseInt(bits_c,10);
  bits_m = parseInt(bits_m,10);
  
  // expo_2 größer als bias => Inf oder NaN
  if(expo_2 > bias){
    InfNaN(bits_m, bits_c);
  }
  else{
    // expo_2 kleiner als -bias => denormalisiert(oder 0)
    if(expo_2 <= -bias){
      mantisse = denormalisiert(mantisse, expo_2, bits_m, bits_c, bias);
    }
    else{
      // normalisierte Zahl
      //if(-bias < expo_2 && expo_2 <= bias){
      normalisiert(mantisse, expo_2, bits_m, bits_c, bias);
    }
    // Aufrunden
    
    runden(mantisse,bits_m, bits_c);
  } // else-Teil von Inf/NaN
  
  // Vorzeichen
  setSign(sign);
  calcIEEE2Ten();
};

function InfNaN(bits_m, bits_c){
  // +-Inf
  var id_temp = "check_c";
  var id;
  for(var i = 0; i < bits_c; ++i){
    id = id_temp + i;
    document.getElementById(id).checked = true;
  }
  id_temp = "check_m";
  for(var i = 0; i < bits_m; ++i){
    id = id_temp + i;
    document.getElementById(id).checked = false;
  }  
};

function denormalisiert(mantisse, expo_2, bits_m, bits_c, bias){
  var expo_denorm = expo_2;
  mantisse = mantisse.substring(2,mantisse.length);
  mantisse = ("1").concat(mantisse);
  while(expo_denorm < -bias){
    mantisse = ("0").concat(mantisse);
    expo_denorm = expo_denorm+1;        
  }
  mantisse = ("0.").concat(mantisse);
  var id_temp = "check_c";     
  var id;
  for(var i = 0; i < bits_c; ++i){
    id = id_temp + (bits_c-1-i);
      document.getElementById(id).checked = false;
  } 
  // Mantisse eintragen
  id_temp = "check_m";
  var pos_d = mantisse.search(/\./);
  for(var i = 0; i < bits_m; ++i){
    id = id_temp + i;
    if(pos_d >= 0 && i < mantisse.length-pos_d){
      if(mantisse.charAt(pos_d+1+i) === "1"){
        document.getElementById(id).checked = true;
      }
      else
        document.getElementById(id).checked = false; 
    }      
  } 
  return mantisse;  
};

function normalisiert(mantisse, expo_2, bits_m, bits_c, bias){
  var char_str = calcTen2Ex(bias, expo_2);
  var id_temp = "check_c";
  var id;
  for(var i = 0; i < bits_c; ++i){
    id = id_temp + (bits_c-1-i);
    if(char_str.charAt(char_str.length-1-i) === "1"){
      document.getElementById(id).checked = true;
    }
    else
      document.getElementById(id).checked = false;
  }
  // Mantisse eintragen
  id_temp = "check_m";
  var pos_d = mantisse.search(/\./);
  for(var i = 0; i < bits_m; ++i){
    id = id_temp + i;
    if(pos_d >= 0 && i < mantisse.length-pos_d){
      if(mantisse.charAt(pos_d+1+i) === "1"){
        document.getElementById(id).checked = true;
      }
      else
        document.getElementById(id).checked = false;  
    }      
  }
};

function runden(mantisse,bits_m, bits_c){
  var fertig = false;
  var id_temp = "check_m";
  var id;
  var N = bits_m-1;
  if(mantisse.charAt(2+bits_m) === "1"){
    while(!fertig && N >= 0){
      id = id_temp + N;
      if(document.getElementById(id).checked === true){
        document.getElementById(id).checked = false;
        --N;
      }
      else{
        document.getElementById(id).checked = true;
        fertig = true;
      }
    }
    if(!fertig){
      // Alle M-Bits sind auf 0 gerundet, dann erfolgt ein Übertrag auf das nächste C-Bit
      id_temp = "check_c";
      N = bits_c-1;
      while(!fertig && N >= 0){
        id = id_temp + N;
        if(document.getElementById(id).checked === true){
          document.getElementById(id).checked = false;
          --N;
        }
        else{
          document.getElementById(id).checked = true;
          fertig = true;
        }
      }
    }
  } // Aufrunden  
};

function setSign(sign){
  if(-1 === sign)
    document.getElementById("check_v").checked = true;
  else
    document.getElementById("check_v").checked = false;  
};
