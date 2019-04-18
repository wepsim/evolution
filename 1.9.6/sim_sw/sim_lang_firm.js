/*      
 *  Copyright 2015-2019 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
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


/*
 *  Load Firmware
 */

function read_microprg ( context )
{
	   // {
	   //           (TA, R, BW=11, C1=1),
	   //    etiq:  (T2, C0),
	   //           (A0, B=0, C=0)
	   // }

           var microprograma = [];
           var microcomments = [];
           resetComments(context) ;

	   // match mandatory {
	   if (! isToken(context, "{") )
	         return langError(context, "Expected '{' not found") ;

           nextToken(context) ;
	   while (! isToken(context, "}") )
	   {
	       var microInstruccionAux = {};

	       // match optional etiq:
	       if (! isToken(context, "(") )
	       {
	           // match mandatory LABEL
		   var newLabelName = getToken(context) ;
                       newLabelName = newLabelName.substring(0, newLabelName.length-1) ; // remove the ending ':'

		   if ("TAG" != getTokenType(context))
		        return langError(context, "Expected '<label>:' not found but '" + newLabelName + "'.");

	           // semantic check: existing LABEL
		   for (var contadorMCAux in context.etiquetas)
		   {
			if (context.etiquetas[contadorMCAux] == newLabelName)
			    return langError(context, "Label is repeated: " + getToken(context));
		   }
		   context.etiquetas[context.contadorMC] = newLabelName ; 

                   // semantic check: valid token
                   if (newLabelName.match("[a-zA-Z_0-9]*")[0] != newLabelName )
		       return langError(context, "Label format is not valid for '" + getToken(context)  + "'") ;

                   nextToken(context) ;
	       }

	       // match mandatory (
	       if (! isToken(context, "(") )
		     return langError(context, "Expected '(' not found") ;

               nextToken(context) ;
	       while (! isToken(context, ")") )
	       {
		   // match mandatory SIGNAL
		   var nombre_tok = getToken(context).toUpperCase();

		   if (nombre_tok == "MADDR")
		   {
                        nextToken(context) ;
			// match mandatory =
			if (! isToken(context, "=") )
			    return langError(context, "Expected '=' not found") ;

                        nextToken(context) ;
			// match mandatory VALUE
			var labelsNotFoundAux={};
			labelsNotFoundAux["nombre"] = getToken(context) ;
			labelsNotFoundAux["cycle"]  = microprograma.length;
			labelsNotFoundAux["index"]  = context.i;
			labelsNotFoundAux["instruction"] = context.instrucciones.length;

			var etiquetaFounded = 0;
			for (var k in context.etiquetas)
			{
				if ( isToken(context, context.etiquetas[k]) )
				{
					microInstruccionAux[nombre_tok] = k.toString();
					etiquetaFounded = 1;
				}
			}

			if (etiquetaFounded == 0) {
			    context.labelsNotFound.push(labelsNotFoundAux);
			}

                        nextToken(context) ;
			// match optional ,
			if ( isToken(context, ",") )
                             nextToken(context) ;

			continue ;
		   }

                   // semantic check: valid signal id
		   if (typeof simhw_sim_signal(nombre_tok) == "undefined")
		       return langError(context, "Signal does not exists: '" + nombre_tok + "'") ;

                   // semantic check: signal id can be used
		   if (typeof simhw_sim_signal(nombre_tok).forbidden != "undefined")
		       return langError(context, "Signal '" + nombre_tok + "' cannot be used directly, please use the Control Unit signals instead.") ;

		   microInstruccionAux[nombre_tok] = 1; // signal is active so far...

                   nextToken(context) ;
		   // match optional =
		   if ( isToken(context, "=") )
		   {
                        nextToken(context) ;
			// match mandatory VALUE
			microInstruccionAux[nombre_tok] = parseInt(getToken(context) , 2);

                        // semantic check: valid value
                        if (getToken(context).match("[01]*")[0] != getToken(context))
			    return langError(context, "Incorrect binary format: " + getToken(context)) ;

                        // semantic check: value within range
		        if (microInstruccionAux[nombre_tok] >= Math.pow(2, simhw_sim_signal(nombre_tok).nbits))
		            return langError(context, "Value out of range: " + getToken(context)) ;

                        nextToken(context) ;
		   }

		   // match optional ,
		   if ( isToken(context, ",") )
                        nextToken(context) ;
	       }

               var acc_cmt = getComments(context) ;
               microcomments.push(acc_cmt);
               resetComments(context) ;

	       microprograma.push(microInstruccionAux);
	       context.contadorMC++;

               nextToken(context) ;
	       if ( isToken(context, ",") )
                    nextToken(context) ;
	   }

           // semantic check: empty microcode is not valid
	   if (microprograma.length == 0)
	       return langError(context, "Empty microcode") ;

	   // match mandatory }
           nextToken(context) ;

           return { 'microprograma': microprograma, 
                    'microcomments': microcomments } ;
}

function read_native ( context )
{
           var microprograma = [];
           var microcomments = [];

	   // match mandatory {
	   if (! isToken(context, "{") )
	         return langError(context, "Expected '{' not found") ;

	   // read the rest...
	   nextNative(context) ;

	   var microInstruccionAux = {} ;
	   microInstruccionAux["NATIVE"] = getToken(context) ;

	   microprograma.push(microInstruccionAux) ;
           microcomments.push('') ;

	   // match mandatory }
           nextToken(context) ;

           return { 'microprograma': microprograma, 
                    'microcomments': microcomments } ;
}

function loadFirmware (text)
{
           var     xr_info = simhw_sim_ctrlStates_get() ;
           var all_ones_co = "1".repeat(xr_info.ir.default_eltos.co.length) ;

           var context = {} ;
	   context.line           	= 1 ;
	   context.error          	= null ;
	   context.i              	= 0 ;
	   context.contadorMC     	= 0 ;
	   context.etiquetas      	= {} ;
	   context.labelsNotFound 	= [] ;
	   context.instrucciones  	= [] ;
	   context.co_cop         	= {} ;
	   context.registers      	= [] ;
           context.text           	= text ;
	   context.tokens         	= [] ;
	   context.token_types         	= [] ;
	   context.t              	= 0 ;
	   context.newlines       	= [] ;
	   context.pseudoInstructions	= [];
	   context.stackRegister	= null ;
           context.comments             = [] ;

           nextToken(context) ;
           while (context.t < context.text.length)
           {

// *registers
// {
//    0=$zero,
//    30=$fp,
//    31=$ra
// }*

               if (isToken(context,"registers"))
               {
                       nextToken(context) ;
                       if (! isToken(context, "{")) 
                             return langError(context, "Expected '{' not found") ;

                       nextToken(context) ;
                       while (! isToken(context, "}"))
                       {
                           var nombre_reg = getToken(context) ;

                           nextToken(context) ;
                           if (! isToken(context, "=")) 
				 return langError(context, "Expected '=' not found") ;

                           nextToken(context) ;
                           context.registers[nombre_reg] = getToken(context) ;

                           nextToken(context) ;
			   if (isToken(context, "("))
			   {
				if (context.stackRegister != null)
				    return langError(context, "Duplicate definition of stack pointer");

				nextToken(context);
				if (! isToken(context, "stack_pointer"))
				    return langError(context, "Expected stack_pointer token not found");

				context.stackRegister = nombre_reg;

				nextToken(context);
				if (! isToken(context, ")"))
				    return langError(context, "Expected ')' not found");

				nextToken(context);
			   }
			
                           if (isToken(context,",")) 
                               nextToken(context);
                       }

                       nextToken(context);
                       continue ;
               }

//
// *pseudoinstructions 
// {
//    li reg num { lui reg high(num) ; ori reg reg low(num) }
// }*
//

	       if (isToken(context,"pseudoinstructions"))
	       {
			nextToken(context);
			if(! isToken(context, "{"))
			     return langError(context, "Expected '{' not found");

			nextToken(context);
			while (! isToken(context, "}"))
			{
				var pseudoInstructionAux = {};			
				var pseudoInitial	 = {};
				pseudoInitial.signature	 = "";
				pseudoInitial.name	 = "";
				pseudoInitial.fields	 = [];
				pseudoInitial.name	 = getToken(context);
				pseudoInitial.signature	 = pseudoInitial.signature + getToken(context) + "," ;
				nextToken(context);
				while (! isToken(context, "{"))
				{
					var pseudoFieldAux	  = {};
					pseudoFieldAux.name	  = getToken(context);
					pseudoFieldAux.type	  = getToken(context).replace("num", "inm");
					pseudoFieldAux.type       = pseudoFieldAux.type.replace(/[_0-9]+$/, '');

					switch(pseudoFieldAux.type){
						case "reg":
						case "inm":
						case "addr":
						case "address": 
							break;
						default:						
							return langError(context, "Invalid parameter '" + pseudoFieldAux.type + "'. It only allows the following fields: reg, num, inm, addr, address") ;					
					}

					pseudoInitial.fields.push(pseudoFieldAux);
					pseudoInitial.signature = pseudoInitial.signature + getToken(context) + ",";
					nextToken(context);
					if(isToken(context, ","))
						nextToken(context);
				}
			 	nextToken(context);
				pseudoInitial.signature = pseudoInitial.signature.substr(0, pseudoInitial.signature.length-1).replace(/num/g,"inm"); 
				pseudoInstructionAux["initial"]=pseudoInitial;	
				var contPseudoFinish=0;

				var pseudoFinishAux = {};
				pseudoFinishAux.signature="";
				
				var inStart = 0;
				var cont = false;

				while (! isToken(context, "}"))
				{
					if(inStart == 0){
						for(i=0; i<context.instrucciones.length; i++){
							if(context.instrucciones[i].name == getToken(context)){
								cont = true;
								break;
							}	
						}
						if(!cont)
							return langError(context, "Undefined instruction '" + getToken(context) + "'");
					}

					if(getToken(context) == ";")
						inStart = 0;
					else
						inStart++;

					pseudoFinishAux.signature = pseudoFinishAux.signature + getToken(context) + " ";
					nextToken(context);
				}
				pseudoInstructionAux["finish"]=pseudoFinishAux;
				pseudoInstructionAux["finish"].signature=pseudoInstructionAux["finish"].signature.replace(';','\n');
				context.pseudoInstructions.push(pseudoInstructionAux);
				nextToken(context);
			}

			nextToken(context);
			continue ;
		}

// *begin {
//            (XX, Y, BW=11),
//     fetch: (X2, X0),
//            (A0, B=0, C=0)
// }*

               if (isToken(context,"begin"))
               {
                   var instruccionAux = {};
                   instruccionAux["name"]     = getToken(context) ;
                   instruccionAux["mc-start"] = context.contadorMC ;

	           nextToken(context);

	           // match optional ,
	           if (isToken(context,",")) 
		       nextToken(context);

	           // match optional native
	           instruccionAux["native"] = false;
	           if (isToken(context, "native")) 
		   {
	               instruccionAux["native"] = true;
		       nextToken(context);

	               // match optional ,
	               if (isToken(context,",")) 
		           nextToken(context);

	               // add 'fetch' label
		       context.etiquetas[context.contadorMC] = "fetch" ; 
	           }

	           if (true == instruccionAux["native"])
                        var ret = read_native(context) ;
		   else var ret = read_microprg(context) ;

                   if (typeof ret.error != "undefined")
                       return ret ;

                   instruccionAux["signature"]       = "begin" ;
		   instruccionAux["signatureGlobal"] = "begin" ;
		   instruccionAux["signatureUser"]   = "begin" ;
		   instruccionAux["signatureRaw"]    = "begin" ;
                   instruccionAux["microcode"]       = ret.microprograma ;
                   instruccionAux["microcomments"]   = ret.microcomments ;
		   context.instrucciones.push(instruccionAux);

                   context.contadorMC = context.contadorMC + 9; // padding between instrucctions
                   continue ;
               }

// *li reg val {*
//             co=000000,
//             nwords=1,
//             reg=reg(25,21),
//             val=inm(15,0),
//             {
//                 (SE=0, OFFSET=0, SIZE=10000, T3=1, LE=1, MR=0, RE=10101, A0=1, B=1, C=0)
//             }
// }

               var instruccionAux = {};
	       instruccionAux["name"]     = getToken(context) ;
	       instruccionAux["mc-start"] = context.contadorMC ;

               // semantic check: valid instruction name
               if (instruccionAux["name"].match("[a-zA-Z_0-9]*")[0] != instruccionAux["name"])
	           return langError(context, "Instruction name '" + instruccionAux["name"] + "' is not valid for [a-zA-Z_0-9]*") ;

	       var firma = "";
	       var firmaGlobal= "";
	       var firmaUsuario= "";
	       var numeroCampos = 0;
	       var campos = [];

	       firma = getToken(context)  + ',';
	       firmaUsuario = getToken(context) + " ";
	       nextToken(context);

               // match optional ,
	       while (isToken(context, ',')) 
	    	      nextToken(context);

	       while (! isToken(context,"{"))
	       {
                   // match optional ,
	           while (isToken(context, ',')) 
			  nextToken(context);

		   var plus_found = false;

                   // match optional FIELD
		   if ( !isToken(context, ",") && !isToken(context, "(") && !isToken(context, ")") )
                   {
		       var campoAux = {};
		       var auxValue = getToken(context);
		       
		       if (auxValue[auxValue.length-1] == "+") 
                       {
			   auxValue = auxValue.substring(0,auxValue.length-1);
			   plus_found = true;
		       }

		       campoAux["name"] = auxValue ;
		       campos.push(campoAux);
		       numeroCampos++;
		       firma = firma + auxValue ;
		       firmaUsuario = firmaUsuario + auxValue;
		       nextToken(context);

		       if (numeroCampos > 100)
			   return langError(context, "more than 100 fields in a single instruction.") ;
		       if (auxValue == "co")
			   return langError(context, "instruction field has 'co' as name.") ;
		       if (auxValue == "nwords")
			   return langError(context, "instruction field has 'nwords' as name.") ;
		   } 

                   // match optional "(" FIELD ")"
		   if (isToken(context, "(")) 
                   {
		           firma = firma + ',(';

			   if (plus_found) 
                                // next line needs concatenate '+' otherwise saveFirmware is not going to work!
                                firmaUsuario = firmaUsuario + '+('; 
			   else	firmaUsuario = firmaUsuario + ' (';

		           nextToken(context);

			   if ( !isToken(context, ",") && !isToken(context, "(") && !isToken(context, ")") )
			   {
			       var campoAux = {};
			       campoAux["name"] = getToken(context) ;
			       campos.push(campoAux);
			       numeroCampos++;

			       firma = firma + getToken(context) ;
			       firmaUsuario = firmaUsuario + getToken(context);			       

			       nextToken(context);
			   }
			   else
		           {
			       return langError(context,
			    			"'token' is missing after '(' on: " + 
                                                context.co_cop[instruccionAux.co].signature) ;
		           }

			   if (isToken(context,")"))
			   {
				firma = firma + ')';
				firmaUsuario = firmaUsuario + ')';

  				nextToken(context);
			   }
			   else
		           {
			       return langError(context,
			    			    "')' is missing on: " + 
                                                    context.co_cop[instruccionAux.co].signature) ;
		           }
                   }

	           firma = firma + ',';
		   firmaUsuario = firmaUsuario + ' ';
	       }

	       firma = firma.substr(0, firma.length-1);
	       firma = firma.replace(/,,/g, ",") ;
	       firmaUsuario = firmaUsuario.substr(0, firmaUsuario.length-1);
	       firmaUsuario = firmaUsuario.replace(/  /g, " ") ;
	       instruccionAux["signature"]       = firma;
               instruccionAux["signatureGlobal"] = firma;
	       instruccionAux["signatureUser"]   = firmaUsuario;
	       instruccionAux["signatureRaw"]    = firmaUsuario;

// li reg val {
//             *co=000000,*
//             nwords=1,
//             reg=reg(25,21),
//             val=inm(15,0),
//             {
//                 (SE=0, OFFSET=0, SIZE=10000, T3=1, LE=1, MR=0, RE=10101, A0=1, B=1, C=0)
//             }
// }

	       nextToken(context);
	       // match mandatory co
	       if (! isToken(context,"co"))
		     return langError(context, "Expected keyword 'co' not found") ;

	       nextToken(context);
	       // match mandatory =
	       if (! isToken(context,"="))
	    	     return langError(context, "Expected '=' not found") ;

	       nextToken(context);
	       // match mandatory CO
	       instruccionAux["co"] = getToken(context) ;

	       // semantic check: valid value
	       if (    (getToken(context).match("[01]*")[0] != getToken(context)) 
                    || (getToken(context).length != xr_info.ir.default_eltos.co.length) ) 
               {
	           return langError(context, "Incorrect binary format on 'co': " + getToken(context)) ;
               }

	       // semantic check: 'co' is not already used
	       if (instruccionAux["co"] != all_ones_co)
	       {
	           if ( (typeof context.co_cop[instruccionAux["co"]] != "undefined") &&
	                       (context.co_cop[instruccionAux["co"]].cop == null) )
	           {
	   	         return langError(context,
			         "'co' is already been used by: " + context.co_cop[instruccionAux.co].signature) ;
	           }

                   if (typeof context.co_cop[instruccionAux.co] == "undefined")
	           {
	               context.co_cop[instruccionAux.co] = {} ;
   	               context.co_cop[instruccionAux.co].signature = instruccionAux.signature ;
                       context.co_cop[instruccionAux.co].cop       = null ;
	           }
	       }

	       nextToken(context);
	       // match optional ,
	       if (isToken(context,","))
	           nextToken(context);

// li reg val {
//             co=000000,
//             *[cop=0000,]*
//             nwords=1,
//             reg=reg(25,21),
//             val=inm(15,0),
//             {
//                 (SE=0, OFFSET=0, SIZE=10000, T3=1, LE=1, MR=0, RE=10101, A0=1, B=1, C=0)
//             }
// }

	       // match optional cop
	       if (isToken(context,"cop"))
               {
		       nextToken(context);
		       // match mandatory =
		       if (! isToken(context,"="))
			     return langError(context, "Expected '=' not found") ;

		       nextToken(context);
		       // match mandatory CO
		       instruccionAux["cop"] = getToken(context) ;

		       // semantic check: valid value
		       if (    (getToken(context).match("[01]*")[0] != getToken(context)) 
                            || (getToken(context).length != xr_info.ir.default_eltos.cop.length) )
                       {
		            return langError(context, "Incorrect binary format on 'cop': " + getToken(context)) ;
                       }

		       // semantic check: 'co+cop' is not already used
	               if (        (context.co_cop[instruccionAux.co].cop != null) &&
	                    (typeof context.co_cop[instruccionAux.co].cop[instruccionAux.cop] != "undefined") )
		       {
		   	   return langError(context,
			     "'co+cop' is already been used by: " + context.co_cop[instruccionAux.co].cop[instruccionAux.cop]);
		       }
	               if (context.co_cop[instruccionAux.co].cop == null)
	                   context.co_cop[instruccionAux.co].cop = {};
	                   context.co_cop[instruccionAux.co].cop[instruccionAux.cop] = instruccionAux.signature ;

		       nextToken(context);
		       // match optional ,
		       if (isToken(context,","))
			   nextToken(context);
               }

// li reg val {
//             co=000000,
//             *nwords=1,*
//             reg=reg(25,21),
//             val=inm(15,0),
//             {
//                 (SE=0, OFFSET=0, SIZE=10000, T3=1, LE=1, MR=0, RE=10101, A0=1, B=1, C=0)
//             }
// }

	       // match mandatory nwords
	       if (! isToken(context,"nwords")) 
		   return langError(context, "Expected keyword 'nwords' not found") ;

	       nextToken(context);
	       // match mandatory =
	       if (! isToken(context,"=")) 
		   return langError(context, "Expected '=' not found") ;

	       nextToken(context);
	       // match mandatory NWORDS
	       instruccionAux["nwords"] = getToken(context) ;

	       nextToken(context);
	       // match optional ,
	       if (isToken(context,",")) 
		   nextToken(context);

// li reg val {
//             co=000000,
//             nwords=1,
//             *reg=reg(25,21),
//              val=inm(15,0),*
//             {
//                 (SE=0, OFFSET=0, SIZE=10000, T3=1, LE=1, MR=0, RE=10101, A0=1, B=1, C=0)
//             }
// }

	       var camposInsertados = 0;
               var overlapping = {};
	       while (camposInsertados < numeroCampos)
	       {
	           // match mandatory FIELD
	           var tmp_name = getToken(context) ;
	           if (campos[camposInsertados]["name"] != tmp_name)
		       return langError(context, "Unexpected field found: '" + tmp_name + "'") ;

	           nextToken(context);
	           // match mandatory =
	           if (! isToken(context,"=")) 
		       return langError(context, "Expected '=' not found") ;

	           nextToken(context);
	           // match mandatory reg|inm|address
	           if ( !isToken(context, "reg") && !isToken(context, "inm") && !isToken(context, "address") )
		        return langError(context, "Incorrect type of field (reg, inm or address)") ;

	           campos[camposInsertados]["type"] = getToken(context) ;
	           firma = firma.replace("," + campos[camposInsertados]["name"], "," + campos[camposInsertados]["type"]);
	           firma = firma.replace("(" + campos[camposInsertados]["name"], "(" + campos[camposInsertados]["type"]);
	           firma = firma.replace(")" + campos[camposInsertados]["name"], ")" + campos[camposInsertados]["type"]); 
		   firmaUsuario = firmaUsuario.replace(campos[camposInsertados]["name"], campos[camposInsertados]["type"]);                  
 
	           instruccionAux["signature"]     = firma;
		   instruccionAux["signatureUser"] = firmaUsuario;
	           firmaGlobal = firma.replace("address","num");
	           firmaGlobal = firmaGlobal.replace("inm" , "num");
	           instruccionAux["signatureGlobal"] = firmaGlobal;

	           nextToken(context);
	           // match mandatory (
	           if (! isToken(context,"(")) 
		       return langError(context, "Expected '(' not found") ;

	           nextToken(context);
	           // match mandatory START_BIT
	           campos[camposInsertados]["startbit"] = getToken(context) ;

                   // check startbit range
                   var start = parseInt(campos[camposInsertados]["startbit"]);
                   if (start > 32*parseInt(instruccionAux["nwords"])-1)
		       return langError(context, "startbit out of range: " + getToken(context)) ;

	           nextToken(context);
	           // match mandatory ,
	           if (! isToken(context,","))
		       return langError(context, "Expected ',' not found") ;

	           nextToken(context);
	           // match mandatory STOP_BIT
	           campos[camposInsertados]["stopbit"] = getToken(context) ;

                   // check stopbit range
                   var stop  = parseInt(campos[camposInsertados]["stopbit"]);
                   if (stop > 32*parseInt(instruccionAux["nwords"]))
		       return langError(context, "stopbit out of range: " + getToken(context)) ;

                   // check overlapping
                   for (var i=stop; i<=start; i++) 
                   {
                        if (typeof overlapping[i] != "undefined")
		            return langError(context, "overlapping field: " + campos[camposInsertados]["name"]);
                        overlapping[i] = 1;
                   }

	           nextToken(context);
	           // match mandatory )
	           if (! isToken(context,")"))
		       return langError(context, "Expected ')' not found") ;

	           nextToken(context);
	           if (campos[camposInsertados]["type"] == "address")
	           {
	               // match mandatory abs|rel
		       if (getToken(context) !="abs" && getToken(context) !="rel")
		    	   return langError(context, "Type of addressing incorrect (abs or rel)") ;

	               // match mandatory ADDRESS_TYPE
		       campos[camposInsertados]["address_type"] = getToken(context) ;
		       nextToken(context);
	           }

	           // match optional ,
	           if (isToken(context, ","))
		       nextToken(context);

	           camposInsertados++;
	       }

	       instruccionAux["fields"] = campos;

// li reg val {
//             co=000000,
//             nwords=1,
//             reg=reg(25,21),
//             val=inm(15,0),
//             *[native,]*
//             {
//                 (SE=0, OFFSET=0, SIZE=10000, T3=1, LE=1, MR=0, RE=10101, A0=1, B=1, C=0)
//             }
// }

	       instruccionAux["native"] = false;

	       // match optional 'native' + ','
	       if (isToken(context, "native")) 
	       {
	           instruccionAux["native"] = true;
		   nextToken(context);

	           if (isToken(context,",")) 
		       nextToken(context);
	       }

// li reg val {
//             co=000000,
//             nwords=1,
//             reg=reg(25,21),
//             val=inm(15,0),
//             *{
//                 (SE=0, OFFSET=0, SIZE=10000, T3=1, LE=1, MR=0, RE=10101, A0=1, B=1, C=0)
//             }*
// }

	           if (true == instruccionAux["native"])
                        var ret = read_native(context) ;
		   else var ret = read_microprg(context) ;

                   if (typeof ret.error != "undefined")
                       return ret ;

               instruccionAux["microcode"]     = ret.microprograma ;
               instruccionAux["microcomments"] = ret.microcomments ;
	       context.instrucciones.push(instruccionAux);

               context.contadorMC = context.contadorMC + 9; // padding between instrucctions

// li reg val {
//             co=000000,
//             nwords=1,
//             reg=reg(25,21),
//             val=inm(15,0),
//             {
//                 (SE=0, OFFSET=0, SIZE=10000, T3=1, LE=1, MR=0, RE=10101, A0=1, B=1, C=0)
//             }
// *}*

               if (! isToken(context,"}")) 
                   return langError(context, "Expected '}' not found") ;

               nextToken(context);
           }

           // CHECK: stack_pointer exists
	   if (context.stackRegister == null)
	       return langError(context, "Stack pointer register was not defined");

           // CHECK: fetch exists + fetch label
           var found = false ;
           for (var i=0; i<context.instrucciones.length; i++)
           {
                if (context.instrucciones[i].name == "begin")
                {
                    for (var j=0; j<context.instrucciones[i].microcode.length; j++)
                    {
		         if ( (typeof context.etiquetas[j] != "undefined") && (context.etiquetas[j] == "fetch") ) {
                               found = true;
                         }
                    }
		    if (found === false)
		        return langError(context, "label 'fetch' not defined") ;
                }
           }
           if (found === false)
	       return langError(context, "'begin' not found") ;

           // TO RESOLVE co=111111 (111111 === "please, find one free 'co' for me...")
           var first_co = 0 ;
           var last_co  = Math.pow(2,6) - 1 ;
           var label    = "" ;

           for (var i=0; i<context.instrucciones.length; i++)
           {
                if ( (context.instrucciones[i].name != "begin") &&
                     (context.instrucciones[i].co   == "111111") )
                {
			for (var j=first_co; j<last_co; j++) 
			{
			     label = j.toString(2) ;
			     label = "000000".substring(0, 6 - label.length) + label ;

			     if (typeof context.co_cop[label] == "undefined") 
				 break;
			}

			if (j >= last_co) {
		             return langError(context, "There is not enough 'co' codes available for instructions") ;
			}

                        context.instrucciones[i].co = label ;

	                context.co_cop[label] = {} ;
   	                context.co_cop[label].signature = context.instrucciones[i].signature ;
                        context.co_cop[label].cop       = null ;

			first_co = j ;
                }
           }

           // TO RESOLVE labels
	   var labelsFounded=0;
	   if (context.labelsNotFound.length>0)
	   {
		for (var i=0; i<context.labelsNotFound.length; i++)
		{
			for (var j in context.etiquetas)
			{
				if (context.etiquetas[j] == context.labelsNotFound[i].nombre)
				{
				    context.instrucciones[context.labelsNotFound[i].instruction].microcode[context.labelsNotFound[i].cycle].MADDR = j;
				    labelsFounded++;		
				}	
			}

			if (labelsFounded == 0)
			{
                                // CHECK: label is defined
				return langError(context, "MADDR label not found : " + context.labelsNotFound[i].nombre) ;
			}

                        labelsFounded = 0;
		}
	   }

	   // native -> native_jit
	   var mk_native = "" ;
	   for (var i=0; i<context.instrucciones.length; i++)
	   {
		   var ins = context.instrucciones[i] ;
		   if (false == ins["native"]) {
		       continue ;
		   }

		   for (var j=0; j<ins["microcode"].length; j++)
		   {
			if (typeof ins["microcode"][j].NATIVE != "undefined") 
			{
			    mk_native += "context.instrucciones[" + i + "][\"microcode\"][" + j + "][\"NATIVE_JIT\"] = " + 
			                 " function() {\n" +
					 "\t var fields = simcore_native_get_fields(\"" + ins["signatureRaw"] + "\");\n" + 
					     ins["microcode"][j].NATIVE + 
					 "\n};\n " ;
			}
		   }
	   }
	   eval(mk_native) ;

           // co_cop_hash
	   var fico  = 0 ;
	   var ficop = 0 ;
	   context.cocop_hash = {} ;
	   for (var fi in context.instrucciones)
	   {
		 if (context.instrucciones[fi].name == "begin") {
		     continue ;
		 }

		 fico  = context.instrucciones[fi].co ;
		 if (typeof context.cocop_hash[fico] == "undefined") {
		     context.cocop_hash[fico] = {} ;
		 }

		 if (typeof context.instrucciones[fi].cop == "undefined") {
		     context.cocop_hash[fico].withcop = false ;
		     context.cocop_hash[fico].i       = context.instrucciones[fi] ;
		 } else {
		     ficop = context.instrucciones[fi].cop ;
		     context.cocop_hash[fico].withcop = true ;
		     context.cocop_hash[fico][ficop]  = context.instrucciones[fi] ;
		 }
	   }

           // return results
           var ret = {} ;
           ret.error              = null ;
           ret.firmware           = context.instrucciones ;
           ret.labels_firm        = context.etiquetas ;
           ret.mp                 = {} ;
           ret.seg                = {} ;
           ret.registers          = context.registers ;
           ret.pseudoInstructions = context.pseudoInstructions ;
	   ret.stackRegister	  = context.stackRegister ;
	   ret.cocop_hash	  = context.cocop_hash ;

           return ret ;
}

/*
 *  Save Firmware
 */

function saveFirmware ( SIMWARE )
{
	var file = "";
	for (var i=0; i<SIMWARE.firmware.length; i++)
	{
		file += SIMWARE.firmware[i].signatureRaw;
		file += " {" + '\n';

		if (typeof SIMWARE.firmware[i].co != "undefined")
		{
			file += '\t' +"co=" + SIMWARE.firmware[i].co + "," + '\n';
		}

		if (typeof SIMWARE.firmware[i].cop != "undefined")
		{
			file += '\t' +"cop=" + SIMWARE.firmware[i].cop + "," + '\n';
		}

		if (typeof SIMWARE.firmware[i].nwords != "undefined")
		{
			file += '\t' + "nwords=" + SIMWARE.firmware[i].nwords + "," + '\n'; 
		}

		if (typeof SIMWARE.firmware[i].fields != "undefined")
		{	
			if (SIMWARE.firmware[i].fields.length>0)
			{
				for (var j=0;j<SIMWARE.firmware[i].fields.length;j++)
				{
					file += '\t' + SIMWARE.firmware[i].fields[j].name + " = " + SIMWARE.firmware[i].fields[j].type;
					file += "(" + SIMWARE.firmware[i].fields[j].startbit + "," + SIMWARE.firmware[i].fields[j].stopbit + ")";					
					if (SIMWARE.firmware[i].fields[j].type == "address")
					{
						file += SIMWARE.firmware[i].fields[j].address_type;
					}
					file += "," + '\n'; 
				}
			}
		}

		if (typeof SIMWARE.firmware[i].microcode != "undefined")
		{
			var addr=SIMWARE.firmware[i]["mc-start"];
			if (SIMWARE.firmware[i].name != "begin")
			{
				file += '\t' + '{' ;
			}

			for (var j=0; j<SIMWARE.firmware[i].microcode.length; j++)
			{
			        if ("" != SIMWARE.firmware[i].microcomments[j])
                                    file += '\n\t\t# ' + SIMWARE.firmware[i].microcomments[j];

				if (typeof SIMWARE.labels_firm[addr] != "undefined")
				     file += '\n' + SIMWARE.labels_firm[addr] + ":\t"; 
				else file += '\n' + '\t' + '\t';

				file += "(";
				var anySignal=0;
				for (var k in SIMWARE.firmware[i].microcode[j])
				{
					if ("MADDR" == k)
                                        {
                                            var val = SIMWARE.firmware[i].microcode[j][k];
                                            if (typeof SIMWARE.labels_firm[val] == "undefined")
                                                 file += k + "=" + val.toString(2) + ", ";
                                            else file += k + "=" + SIMWARE.labels_firm[val] + ", ";
                                            continue;
                                        }

					file += k + "=" + SIMWARE.firmware[i].microcode[j][k].toString(2) + ", ";

					anySignal=1;
				}
				if (anySignal==1)
				{
					file = file.substr(0, file.length - 2);
				}
				file += "),";
				addr++;
			}

			file = file.substr(0, file.length - 1);
			if (SIMWARE.firmware[i].name!="begin")
			{
				file += '\n\t}';
			}
		}

		file += '\n}\n\n';
	}	

	if ( (typeof SIMWARE.registers != "undefined") && (SIMWARE.registers.length > 0) )
	{
		file += 'registers' + '\n{\n';
		for (var i = 0; i< SIMWARE.registers.length; i++)
		{
		     if (SIMWARE.stackRegister == i)
		     	  file += '\t' + i + "=" + SIMWARE.registers[i] + " (stack_pointer)," + '\n';
                     else file += '\t' + i + "=" + SIMWARE.registers[i] + "," + '\n';
		}
		file  = file.substr(0, file.length-2);
		file += '\n}\n';
	}

        // TODO: save pseudo-instructions

	return file;
}


/*
 *  Auxiliar firmware interface
 */

function decode_instruction ( curr_firm, ep_ir, binstruction )
{
    var ret = { 
                 "oinstruction": null,
                  op_code: 0,
                 cop_code: 0
              } ;

    // instructions as 32-string
    var bits = binstruction.toString(2) ;
        bits = "00000000000000000000000000000000".substring(0, 32 - bits.length) + bits ;

    // op-code 
    var co = bits.substr(ep_ir.default_eltos.co.begin, ep_ir.default_eltos.co.length); 
    ret.op_code = parseInt(co, 2) ;

    // cop-code
    var cop = bits.substr(ep_ir.default_eltos.cop.begin, ep_ir.default_eltos.cop.length); 
    ret.cop_code = parseInt(cop, 2) ;

    if (false == curr_firm.cocop_hash[co].withcop)
         ret.oinstruction = curr_firm.cocop_hash[co].i ;
    else ret.oinstruction = curr_firm.cocop_hash[co][cop] ;

    return ret ;
}

function decode_ram ( )
{
    var sram = "\n" ;

    var curr_ircfg = simhw_sim_ctrlStates_get().ir ;
    var curr_firm  = simhw_internalState('FIRMWARE') ;
    var curr_MP    = simhw_internalState('MP') ;
    for (var address in curr_MP)
    {
        var binstruction = curr_MP[address].toString(2) ;
            binstruction = "00000000000000000000000000000000".substring(0, 32-binstruction.length) + binstruction;
        sram += "0x" + parseInt(address).toString(16) + ":" + 
                decode_instruction(curr_firm, curr_ircfg, binstruction).oinstruction + "\n" ;
    }

    return sram ;
}

