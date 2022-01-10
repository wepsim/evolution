/*
 *  Copyright 2015-2021 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
 *
 *  This file is part of WepSIM.
 *
 *  WepSIM is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WepSIM is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with WepSIM.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


        function simhwelto_prepare_hash ( ahw )
        {
	    // build element hash
            ahw.elements_hash = {} ;

	    // build element hash, by_belong
            ahw.elements_hash.by_belong = {} ;
	    for (var e in ahw.elements)
	    {
                 elto = ahw.elements[e] ;

                 if (typeof ahw.elements_hash.by_belong[elto.belongs] == "undefined") {
                     ahw.elements_hash.by_belong[elto.belongs] = [] ;
                 }

                 ahw.elements_hash.by_belong[elto.belongs].push(elto) ;
	    }

	    // return hash
            return ahw.elements_hash ;
        }

        function simhwelto_show_components ( ahw )
        {
	    var o = '' ;
	    var e = '' ;

	    // header row...
	    o +=    'Component'.padEnd(10, ' ') + ';' +
	              'Element'.padEnd(15, ' ') + ';' +
	          'States (In)'.padEnd(20, ' ') + ';' +
	         'States (Out)'.padEnd(20, ' ') + ';' +
	              'Signals'.padEnd(10, ' ') + '\n' ;

	    // rows of elements...
	    for (var b in ahw.elements_hash.by_belong)
	    {
	         for (var j=0; j<ahw.elements_hash.by_belong[b].length; j++)
	         {
		         // new row
                         elto = ahw.elements_hash.by_belong[b][j] ;

			 // 1) component
			 o += b.padEnd(10, ' ') + ';' ;

			 // 2) name
			 o += elto.name.padEnd(15, ' ') + ';' ;

			 // 3) list of input states
                         e = '' ;
			 for (i=0; i<elto.states_inputs.length; i++) {
			      e += elto.states[elto.states_inputs[i]].ref + ' ' ;
			 }
			 o += e.padEnd(20, ' ') + ';' ;

			 // 4) list of output states
                         e = '' ;
			 for (i=0; i<elto.states_outputs.length; i++) {
			      e += elto.states[elto.states_outputs[i]].ref + ' ' ;
			 }
			 o += e.padEnd(20, ' ') + ';' ;

			 // 5) list of signals
                         e = '' ;
			 for (var es in elto.signals) {
		              e += elto.signals[es].ref + ' ' ;
			 }
			 o += e.padEnd(10, ' ') + '\n' ;
	         }
	    }

	    // return output
            return o ;
        }

	function simhwelto_describe_component_enum ( array_eltos, hash_eltos, enum_name )
	{
	   var o = "" ;

           // enumerate...
	   o += "It has " + array_eltos.length + " " + enum_name + ": " ;
		for (var i=0; i<array_eltos.length; i++)
                {
		     o += '(' + (i+1) + ') ' + hash_eltos[array_eltos[i]].description ;

                     if (i != array_eltos.length - 1) {
                         o += ', ' ;
		     }
		}
	   o += ". " ;

	   return o ;
	}

	function simhwelto_describe_component ( elto, format )
	{
	   var o = "" ;

           if (format == "html")
           {
	       o += elto.description + '.<br><ul>' +
	            '<li>' +
		    simhwelto_describe_component_enum(elto.states_inputs,  elto.states,  "inputs")  + '<br>' +
		    '<li>' +
		    simhwelto_describe_component_enum(elto.states_outputs, elto.states,  "outputs") + '<br>' +
		    '<li>' +
		    simhwelto_describe_component_enum(elto.signals_inputs, elto.signals, "signals") + '<br>' +
		    '</ul>' ;

	       return o ;
           }

	   // "text" by default
	   return elto.description + ". " +
	          simhwelto_describe_component_enum(elto.states_inputs,  elto.states,  "inputs") +
	          simhwelto_describe_component_enum(elto.states_outputs, elto.states,  "outputs") +
	          simhwelto_describe_component_enum(elto.signals_inputs, elto.signals, "signals") ;
	}

