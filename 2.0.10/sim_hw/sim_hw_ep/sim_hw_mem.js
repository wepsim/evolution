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
	 *  Memory
	 */

        ep_components.MEMORY = {
		                  name: "MEMORY", 
		                  version: "1", 
		                  abilities:    [ "MEMORY" ],

		                  // ui: details
                                  details_name: [ "MEMORY", "MEMORY_CONFIG" ],
                                  details_fire: [ ['svg_p:text3001'], [] ],

		                  // state: write_state, read_state, get_state
		                  write_state: function ( vec ) {
                                                  if (typeof vec.MEMORY == "undefined")
                                                      vec.MEMORY = {} ;

						  var key = 0 ;
						  var value = 0 ;
					          for (var index in ep_internal_states.MP)
						  {
						       value = parseInt(ep_internal_states.MP[index]) ;
						       if (value != 0) 
						       {
					                   key = parseInt(index).toString(16) ;
							   vec.MEMORY["0x" + key] = {"type":  "memory", 
								                     "default_value": 0x0,
								                     "id":    "0x" + key,
								                     "op":    "=", 
								                     "value": "0x" + value.toString(16)} ;
						       }
						  }

						  return vec;
				              },
		                  read_state: function ( vec, check ) {
                                                  if (typeof vec.MEMORY == "undefined")
                                                      vec.MEMORY = {} ;

					          var key = parseInt(check.id).toString(16) ;
					          var val = parseInt(check.value).toString(16) ;
					          if ("MEMORY" == check.type.toUpperCase().trim())
                                                  {
						      vec.MEMORY["0x" + key] = {"type":  "memory", 
							  	                "default_value": 0x0,
								                "id":    "0x" + key,
								                "op":    check.condition,
								                "value": "0x" + val} ;
                                                      return true ;
                                                  }

                                                  return false ;
				             },
		                  get_state: function ( pos ) {
						  var index = parseInt(pos) ;
						  if (typeof ep_internal_states.MP[index] != "undefined") {
						      return "0x" + parseInt(ep_internal_states.MP[index]).toString(16) ;
					          }

					          return null ;
				             },

		                  // native: get_value, set_value
		                  get_value: function ( elto ) {
                                                 return (simhw_internalState_get('MP', elto) >>> 0) ;
				             },
		                  set_value: function ( elto, value ) {
						 simhw_internalState_set('MP', elto, value) ;
						 return value ;
				             }
                            	};


	/*
	 *  Internal States
	 */

        ep_internal_states.segments  = {} ;
        ep_internal_states.MP        = {} ;
        ep_internal_states.MP_wc     = 0 ;


        /*
         *  Signals
         */

        ep_signals.MRDY      = { name: "MRDY", 
                                 visible: true, type: "L", value: 0, default_value:0, nbits: "1", 
                                 depends_on: ["CLK"],
		                 behavior: ["FIRE_IFCHANGED MRDY C", "FIRE_IFCHANGED MRDY C"],
                                 fire_name: ['svg_p:tspan3916','svg_p:text3909'], 
                                 draw_data: [[], ['svg_p:path3895','svg_p:path3541']], 
                                 draw_name: [[], []]};

        ep_signals.R         = { name: "R", 
                                 visible: true, type: "L", value: 0, default_value:0, nbits: "1", 
		                 behavior: ["NOP", "MEM_READ BUS_AB BUS_DB BWA MRDY CLK; FIRE MRDY"],
                                 fire_name: ['svg_p:text3533-5-2','svg_p:text3713'], 
                                 draw_data: [[], ['svg_p:path3557','svg_p:path3571']], 
                                 draw_name: [[], []]};

        ep_signals.W         = { name: "W", 
                                 visible: true, type: "L", value: 0, default_value:0, nbits: "1", 
		                 behavior: ["NOP", "MEM_WRITE BUS_AB BUS_DB BWA MRDY CLK; FIRE MRDY"],
                                 fire_name: ['svg_p:text3533-5-08','svg_p:text3527','svg_p:text3431-7'], 
                                 draw_data: [[], ['svg_p:path3559','svg_p:path3575','svg_p:path3447-7']], 
                                 draw_name: [[], []] };


        /*
         *  Syntax of behaviors
         */

        ep_behaviors.MEM_READ       = { nparameters: 6, 
                                        types: ["E", "E", "S", "S", "E"],
                                        operation: function (s_expr) 
                                                   {
						      var address = ep_states[s_expr[1]].value;
                                                      var dbvalue = ep_states[s_expr[2]].value;
                                                      var bw      = ep_signals[s_expr[3]].value;
                                                      var clk     = get_value(ep_states[s_expr[5]].value) ;

                                                      ep_signals[s_expr[4]].value = 0;
						      var remain = get_var(ep_internal_states.MP_wc);
						      if ( 
                                                           (typeof ep_events.mem[clk-1] != "undefined") &&
						           (ep_events.mem[clk-1] > 0) 
                                                         ) {
						              remain = ep_events.mem[clk-1] - 1;
                                                           }
						      ep_events.mem[clk] = remain;
                                                      if (remain > 0) {
                                                          return;
                                                      }

						      var value   = 0;
                                                      address = address & 0xFFFFFFFC;
						      if (typeof  ep_internal_states.MP[address] != "undefined")
						   	  value = ep_internal_states.MP[address];

                                                      // TABLES
                                                      if ( 0 == (bw & 0x0000000C) )
                                                      {  // byte
                                                           if ( 0 == (bw & 0x00000003) )
                                                                dbvalue = (dbvalue & 0xFFFFFF00) | (value & 0x000000FF);
                                                           if ( 1 == (bw & 0x00000003) )
                                                                dbvalue = (dbvalue & 0xFFFF00FF) | (value & 0x0000FF00);
                                                           if ( 2 == (bw & 0x00000003) )
                                                                dbvalue = (dbvalue & 0xFF00FFFF) | (value & 0x00FF0000);
                                                           if ( 3 == (bw & 0x00000003) )
                                                                dbvalue = (dbvalue & 0x00FFFFFF) | (value & 0xFF000000);
                                                      }
                                                      else if ( 1 == (bw & 0x0000000C) )
                                                      {  // half
                                                           if ( 0 == (bw & 0x00000002) )
                                                                dbvalue = (dbvalue & 0xFFFF0000) | (value & 0x0000FFFF);
                                                           if ( 1 == (bw & 0x00000002) )
                                                                dbvalue = (dbvalue & 0x0000FFFF) | (value & 0xFFFF0000);
                                                      }
                                                      else
                                                      {  // word
                                                           dbvalue = value;
                                                      }

                                                      ep_states[s_expr[2]].value = (dbvalue >>> 0);
                                                     ep_signals[s_expr[4]].value = 1;
				                      show_main_memory(ep_internal_states.MP, address, false, false) ;
                                                   },
                                           verbal: function (s_expr) 
                                                   {
					              var verbal = "" ;

						      var address = ep_states[s_expr[1]].value;
                                                      var dbvalue = ep_states[s_expr[2]].value;
                                                      var bw      = ep_signals[s_expr[3]].value;
                                                      var clk     = get_value(ep_states[s_expr[5]].value) ;

					              var bw_type = "word" ;
                                                           if ( 0 == (bw & 0x0000000C) )
							  bw_type = "byte" ;
                                                      else if ( 1 == (bw & 0x0000000C) )
							  bw_type = "half" ;

						      var value = 0 ;
					              if (typeof ep_internal_states.MP[address] != "undefined")
							  value = ep_internal_states.MP[address] ;

                                                      var verbose = get_cfg('verbal_verbose') ;
                                                      if (verbose !== 'math') {
                                                          verbal = "Try to read a " + bw_type + " from memory " + 
							           "at address 0x"  + address.toString(16) + " with value 0x" + value.toString(16) + ". " ;
                                                      }

                                                      verbal = "Memory output = 0x" + value.toString(16) + 
                                                               " (Read a " + bw_type + 
							       " from 0x" + address.toString(16)  + "). " ;

                                                      return verbal ;
                                                   }
                                      };

        ep_behaviors.MEM_WRITE      = { nparameters: 6, 
                                        types: ["E", "E", "S", "S", "E"],
                                        operation: function (s_expr) 
                                                   {
						      var address = ep_states[s_expr[1]].value;
                                                      var dbvalue = ep_states[s_expr[2]].value;
                                                      var bw      = ep_signals[s_expr[3]].value;
                                                      var clk     = get_value(ep_states[s_expr[5]].value) ;

                                                      ep_signals[s_expr[4]].value = 0;
						      var remain = get_var(ep_internal_states.MP_wc);
						      if ( 
                                                           (typeof ep_events.mem[clk-1] != "undefined") &&
						           (ep_events.mem[clk-1] > 0) 
                                                         ) {
						              remain = ep_events.mem[clk-1] - 1;
                                                           }
						      ep_events.mem[clk] = remain;
                                                      if (remain > 0)
                                                          return;

						      var value   = 0;
                                                      address = address & 0xFFFFFFFC;
						      if (typeof  ep_internal_states.MP[address] != "undefined")
						   	  value = ep_internal_states.MP[address];

                                                      // TABLES
                                                      if ( 0 == (bw & 0x0000000C) )
                                                      {  // byte
                                                           if ( 0 == (bw & 0x00000003) )
                                                                value = (value & 0xFFFFFF00) | (dbvalue & 0x000000FF);
                                                           if ( 1 == (bw & 0x00000003) )
                                                                value = (value & 0xFFFF00FF) | (dbvalue & 0x0000FF00);
                                                           if ( 2 == (bw & 0x00000003) )
                                                                value = (value & 0xFF00FFFF) | (dbvalue & 0x00FF0000);
                                                           if ( 3 == (bw & 0x00000003) )
                                                                value = (value & 0x00FFFFFF) | (dbvalue & 0xFF000000);
                                                      }
                                                      else if ( 1 == (bw & 0x0000000C) )
                                                      {  // half
                                                           if ( 0 == (bw & 0x00000002) )
                                                                value = (value & 0xFFFF0000) | (dbvalue & 0x0000FFFF);
                                                           if ( 1 == (bw & 0x00000002) )
                                                                value = (value & 0x0000FFFF) | (dbvalue & 0xFFFF0000);
                                                      }
                                                      else
                                                      {  // word
                                                           value = dbvalue;
                                                      }

						      ep_internal_states.MP[address] = (value >>> 0);
                                                      ep_signals[s_expr[4]].value = 1;
				                      show_main_memory(ep_internal_states.MP, address, true, true) ;
                                                   },
                                           verbal: function (s_expr) 
                                                   {
					              var verbal = "" ;

						      var address = ep_states[s_expr[1]].value;
                                                      var dbvalue = ep_states[s_expr[2]].value;
                                                      var bw      = ep_signals[s_expr[3]].value;
                                                      var clk     = get_value(ep_states[s_expr[5]].value) ;

					              var bw_type = "word" ;
                                                           if ( 0 == (bw & 0x0000000C) )
							  bw_type = "byte" ;
                                                      else if ( 1 == (bw & 0x0000000C) )
							  bw_type = "half" ;

						      var value = 0 ;
					              if (typeof ep_internal_states.MP[address] != "undefined")
							  value = ep_internal_states.MP[address] ;

                                                      var verbose = get_cfg('verbal_verbose') ;
                                                      if (verbose !== 'math') {
                                                          verbal = "Try to write a " + bw_type + " to memory " + 
							           "at address 0x"  + address.toString(16) + 
                                                                   " with value " + value.toString(16) + ". " ;
                                                      }

                                                      verbal = "Memory[0x" + address.toString(16) + "] = " +
							       "0x" + value.toString(16) + 
                                                               " (Write a " + bw_type + 
							       " to 0x" + address.toString(16)  + "). " ;

                                                      return verbal ;
                                                   }
                                    };

        ep_behaviors.MEMORY_RESET = { nparameters: 1,
                                        operation: function (s_expr) 
                                                   {
						       // reset events.mem
                                                       ep_events.mem = {} ;
                                                   },
                                           verbal: function (s_expr) 
                                                   {
                                                       return "Reset main memory (all values will be zeroes). " ;
                                                   }
                                   };

