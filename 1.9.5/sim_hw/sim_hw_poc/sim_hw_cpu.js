/*
 *  Copyright 2015-2018 Felix Garcia Carballeira, Alejandro Calderon Mateos, Javier Prieto Cepeda, Saul Alonso Monsalve
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
	 *  CPU
	 */

        poc_components["CPU"] = {
		                  name: "CPU",
		                  version: "1",
		                  abilities: ["CPU"],
		                  write_state:  function ( vec ) {
                                                  if (typeof vec.CPU == "undefined")
                                                      vec.CPU = {} ;

					          // var internal_reg = ["PC", "MAR", "MBR", "IR", "RT1", "RT1", "RT2", "SR"] ;
					          var internal_reg = ["PC", "SR"] ;

						  var value = 0 ;
					          for (var i=0; i<poc_states.BR.length; i++)
						  {
						      value = parseInt(poc_states.BR[i].value) ;
						      if (value != 0) {
							  vec.CPU["R" + i] = {"type":  "register",
								              "default_value": 0x0,
								              "id":    "R" + i,
								              "op":    "=",
								              "value": "0x" + value.toString(16)} ;
						      }
						  }

					          for (var i=0; i<internal_reg.length; i++)
						  {
						      value = parseInt(poc_states['REG_' + internal_reg[i]].value) ;
						      if (value != 0) {
							  vec.CPU[internal_reg[i]] = {"type":  "register",
								                      "default_value": 0x0,
								                      "id":    internal_reg[i],
								                      "op":    "=",
								                      "value": "0x" + value.toString(16)} ;
						      }
						  }

						  return vec;
				               },
		                  read_state:  function ( vec, check ) {
                                                  if (typeof vec.CPU == "undefined")
                                                      vec.CPU = {} ;

					          var key = check["id"].toUpperCase().trim() ;
					          var val = parseInt(check["value"]).toString(16) ;
					          if ("REGISTER" == check["type"].toUpperCase().trim())
                                                  {
						      vec.CPU[key] = {"type":  "register",
								      "default_value": 0,
								      "id":    key,
								      "op":    check["condition"],
								      "value": "0x" + val} ;
                                                      return true ;
                                                  }

                                                  return false ;
				              },
		                  get_state:  function ( reg ) {
					          var r_reg = reg.toUpperCase().trim() ;
					          if (typeof poc_states['REG_' + r_reg] != "undefined") {
					              return "0x" + get_value(poc_states['REG_' + r_reg]).toString(16) ;
					          }

					              r_reg = r_reg.replace('R','') ;
					          var index = parseInt(r_reg) ;
					          if (typeof poc_states.BR[index] != "undefined") {
					              return "0x" + get_value(poc_states.BR[index]).toString(16) ;
					          }

					          return null ;
				              }
                            	};


	/*
	 *  Default elements at the Instruction Register (IR)
	 */

        poc_ir.default_eltos = {  "co": { "begin":  0, "end":  5, "length": 6 },
			         "cop": { "begin": 27, "end": 31, "length": 5 } } ;


	/*
	 *  Internal States
	 */

        poc_internal_states.MC           = {} ;
        poc_internal_states.MC_dashboard = {} ;
        poc_internal_states.ROM          = {} ;

        poc_internal_states.FIRMWARE     = {} ;
        poc_internal_states.io_hash      = {} ;
        poc_internal_states.fire_stack   = [] ;

        poc_internal_states.tri_state_names = [ "T1","T2","T3","T6","T8","T9","T10","T11" ] ;
        poc_internal_states.fire_visible    = { 'databus': false, 'internalbus': false } ;
        poc_internal_states.filter_states   = [ "REG_IR_DECO,col-12",
                                                "REG_IR,col",  "REG_PC,col",  "REG_SR,col",
                                                "REG_RT1,col",  
                                                "REG_MAR,col", "REG_MBR,col", "REG_MICROADDR,col" ] ;
        poc_internal_states.filter_signals  = [ "A0,0",   "B,0",    "C,0",  
                                                "SELA,5", "SELB,5", "SELC,2", "SELCOP,0", "MR,0", "MC,0",
				        "C0,0", "C1,0",   "C2,0",   "C3,0",   "C4,0",     "C7,0",
				        "T1,0", "T2,0",   "T3,0",   "T6,0",   "T8,0",
                                        "T9,0", "T10,0", "T11,0",
				                "M1,0",   "M7,0",  "MA,0",   "MB,0",
                                                "LC,0",   "SE,0",  "SIZE,0", "OFFSET,0",
                                                "BW,0",   "R,0",    "W,0",   "TA,0",   "TD,0",   "IOR,0","IOW,0",
                                                "TEST_I,0", "TEST_U,0"  ] ;
        poc_internal_states.alu_flags       = { 'flag_n': 0, 'flag_z': 0, 'flag_v': 0, 'flag_c': 0 } ;


	/*
	 *  States
	 */

	/* REGISTER FILE STATES */
	poc_states.BR = [] ;
	poc_states.BR[0]          = {name:"R0",    verbal: "Register  0",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[1]          = {name:"R1",    verbal: "Register  1",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[2]          = {name:"R2",    verbal: "Register  2",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[3]          = {name:"R3",    verbal: "Register  3",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[4]          = {name:"R4",    verbal: "Register  4",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[5]          = {name:"R5",    verbal: "Register  5",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[6]          = {name:"R6",    verbal: "Register  6",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[7]          = {name:"R7",    verbal: "Register  7",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[8]          = {name:"R8",    verbal: "Register  8",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[9]          = {name:"R9",    verbal: "Register  9",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[10]         = {name:"R10",   verbal: "Register 10",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[11]         = {name:"R11",   verbal: "Register 11",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[12]         = {name:"R12",   verbal: "Register 12",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[13]         = {name:"R13",   verbal: "Register 13",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[14]         = {name:"R14",   verbal: "Register 14",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[15]         = {name:"R15",   verbal: "Register 15",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[16]         = {name:"R16",   verbal: "Register 16",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[17]         = {name:"R17",   verbal: "Register 17",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[18]         = {name:"R18",   verbal: "Register 18",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[19]         = {name:"R19",   verbal: "Register 19",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[20]         = {name:"R20",   verbal: "Register 20",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[21]         = {name:"R21",   verbal: "Register 21",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[22]         = {name:"R22",   verbal: "Register 22",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[23]         = {name:"R23",   verbal: "Register 23",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[24]         = {name:"R24",   verbal: "Register 24",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[25]         = {name:"R25",   verbal: "Register 25",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[26]         = {name:"R26",   verbal: "Register 26",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[27]         = {name:"R27",   verbal: "Register 27",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[28]         = {name:"R28",   verbal: "Register 28",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[29]         = {name:"R29",   verbal: "Register 29",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[30]         = {name:"R30",   verbal: "Register 30",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[31]         = {name:"R31",   verbal: "Register 31",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[32]         = {name:"R32",   verbal: "Register 32",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[33]         = {name:"R33",   verbal: "Register 33",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[34]         = {name:"R34",   verbal: "Register 34",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[35]         = {name:"R35",   verbal: "Register 35",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[36]         = {name:"R36",   verbal: "Register 36",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[37]         = {name:"R37",   verbal: "Register 37",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[38]         = {name:"R38",   verbal: "Register 38",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[39]         = {name:"R39",   verbal: "Register 39",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[40]         = {name:"R40",   verbal: "Register 40",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[41]         = {name:"R41",   verbal: "Register 41",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[42]         = {name:"R42",   verbal: "Register 42",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[43]         = {name:"R43",   verbal: "Register 43",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[44]         = {name:"R44",   verbal: "Register 44",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[45]         = {name:"R45",   verbal: "Register 45",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[46]         = {name:"R46",   verbal: "Register 46",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[47]         = {name:"R47",   verbal: "Register 47",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[48]         = {name:"R48",   verbal: "Register 48",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[49]         = {name:"R49",   verbal: "Register 49",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[50]         = {name:"R50",   verbal: "Register 50",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[51]         = {name:"R51",   verbal: "Register 51",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[52]         = {name:"R52",   verbal: "Register 52",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[53]         = {name:"R53",   verbal: "Register 53",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[54]         = {name:"R54",   verbal: "Register 54",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[55]         = {name:"R55",   verbal: "Register 55",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[56]         = {name:"R56",   verbal: "Register 56",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[57]         = {name:"R57",   verbal: "Register 57",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[58]         = {name:"R58",   verbal: "Register 58",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[59]         = {name:"R59",   verbal: "Register 59",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[60]         = {name:"R60",   verbal: "Register 60",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[61]         = {name:"R61",   verbal: "Register 61",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[62]         = {name:"R62",   verbal: "Register 62",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states.BR[63]         = {name:"R63",   verbal: "Register 63",  visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };

	poc_states["REG_PC"]     = { name:"PC",  verbal: "Program Counter Register",
                                     visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["REG_MAR"]    = { name:"MAR", verbal: "Memory Address Register",
                                     visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["REG_MBR"]    = { name:"MBR", verbal: "Memory Data Register",
                                     visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["REG_IR"]     = { name:"IR",  verbal: "Instruction Register",
                                     visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["REG_SR"]     = { name:"SR", verbal: "State Register",
                                     visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["REG_RT1"]    = { name:"RT1",  verbal: "Temporal Register 1",
                                     visible:true, nbits:"32", value:0,  default_value:0, draw_data: [] };

	/* BUSES */
	poc_states["BUS_IB"]     = { name:"I_BUS", verbal: "Internal Bus",
                                     visible:false, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["BUS_AB"]     = { name:"A_BUS", verbal: "Address Bus",
                                     visible:false, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["BUS_CB"]     = { name:"C_BUS", verbal: "Control Bus",
                                     visible:false, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["BUS_DB"]     = { name:"D_BUS", verbal: "Data Bus",
                                     visible:false, nbits:"32", value:0,  default_value:0, draw_data: [] };

	/* REGISTER FILE (RELATED) STATES */
	poc_states["RA_T9"]      = { name: "RA_T9",  verbal: "Input of T9 Tristate",
                                     visible:false, nbits: "32", value:0, default_value:0, draw_data: [] };
	poc_states["RB_T10"]     = { name: "RB_T10", verbal: "Input of T10 Tristate",
                                     visible:false, nbits: "32", value:0, default_value:0, draw_data: [] };

	/* (RELATED) SELEC STATES */
	poc_states["SELEC_T3"]   = { name: "SELEC_T3", verbal: "Input of T3 Tristate",
                                     visible:false, nbits: "32", value:0, default_value:0, draw_data: [] };

	poc_states["ALU_T6"]     = { name:"ALU_T6",  verbal: "Input of T6 Tristate",
                                     visible:false, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["MA_ALU"]     = { name:"MA_ALU",  verbal: "Input ALU via MA",
                                     visible:false, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["MB_ALU"]     = { name:"MB_ALU",  verbal: "Input ALU via MB",
                                     visible:false, nbits:"32", value:0,  default_value:0, draw_data: [] };

	poc_states["FLAG_C"]     = { name: "FLAG_C", verbal: "Flag Carry",
                                     visible:true, nbits: "1", value:0, default_value:0, draw_data: [] };
	poc_states["FLAG_V"]     = { name: "FLAG_V", verbal: "Flag Overflow",
                                     visible:true, nbits: "1", value:0, default_value:0, draw_data: [] };
	poc_states["FLAG_N"]     = { name: "FLAG_N", verbal: "Flag Negative",
                                     visible:true, nbits: "1", value:0, default_value:0, draw_data: [] };
	poc_states["FLAG_Z"]     = { name: "FLAG_Z", verbal: "Flag Zero",
                                     visible:true, nbits: "1", value:0, default_value:0, draw_data: [] };
	poc_states["FLAG_I"]     = { name: "FLAG_I", verbal: "Flag Interruption",
                                     visible:true, nbits: "1", value:0, default_value:0, draw_data: [] };
	poc_states["FLAG_U"]     = { name: "FLAG_U", verbal: "Flag User",
                                     visible:true, nbits: "1", value:0, default_value:0, draw_data: [] };

	/* CONTROL UNIT */
	poc_states["REG_MICROADDR"]  = { name: "µADDR", verbal: "Microaddress Register",
                                         visible:true, nbits: "12", value:0,  default_value:0,  draw_data: ['svg_cu:text4667']};
	poc_states["REG_MICROINS"]   = { name: "µINS", verbal: "Microinstruction Register",
                                         visible:true, nbits: "77", value:{}, default_value:{}, draw_data: [] };

	poc_states["FETCH"]          = { name: "FETCH",          verbal: "Input Fetch ",
                                         visible:false, nbits: "12", value:0, default_value:0, draw_data: [] };
	poc_states["ROM_MUXA"]       = { name: "ROM_MUXA",       verbal: "Input ROM ",
                                         visible:false, nbits: "12", value:0, default_value:0, draw_data: [] };
	poc_states["SUM_ONE"]        = { name: "SUM_ONE",        verbal: "Input next microinstruction ",
                                         visible:false, nbits: "12", value:1, default_value:1, draw_data: [] };
	poc_states["MUXA_MICROADDR"] = { name: "MUXA_MICROADDR", verbal: "Input microaddress from microinstruction",
                                         visible:false, nbits: "12", value:0, default_value:0, draw_data: [] };

	poc_states["MUXC_MUXB"]      = { name: "MUXC_MUXB", verbal: "Output of MUX C",
                                         visible:false, nbits: "1",  value:0, default_value:0, draw_data: [] };
	poc_states["INEX"]           = { name: "INEX",      verbal: "Illegal Instruction Exception",
                                         visible:false, nbits: "1",  value:0, default_value:0, draw_data: [] };

	/* DEVICES AND MEMORY */
	poc_states["BS_M1"]          = { name: "BS_M1", verbal: "from Memory",
                                         visible:false, nbits: "32", value:0, default_value:0, draw_data: [] };
	poc_states["BS_TD"]          = { name: "BS_TD", verbal: "Memory",
                                         visible:false, nbits: "32", value:0, default_value:0, draw_data: [] };

	poc_states["INTV"]           = { name: "INTV", verbal: "Interruption Vector",
                                         visible:false, nbits: "8",  value:0, default_value:0, draw_data: [] };


	/* MUX A (RELATED) STATES */
	poc_states["M1_C1"]          = { name:"M1_C1", verbal: "Input of Memory Data Register",
                                         visible:false, nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["M7_C7"]          = { name:"M7_C7", verbal: "Input of State Register",
                                         visible:false, nbits:"32", value:0,  default_value:0, draw_data: [] };

	poc_states["VAL_ZERO"]       = { name: "VAL_ZERO", verbal: "Wired Zero",
                                         visible:false, nbits: "1",  value:0, default_value:0, draw_data: [] };
	poc_states["VAL_ONE"]        = { name: "VAL_ONE",  verbal: "Wired One",
                                         visible:false, nbits: "32", value:1, default_value:1, draw_data: [] };
	poc_states["VAL_FOUR"]       = { name: "VAL_FOUR", verbal: "Wired Four",
                                         visible:false, nbits: "32", value:4, default_value:4, draw_data: [] };

	/* VIRTUAL */
	poc_states["REG_IR_DECO"]    = { name:"IR_DECO",  verbal: "Instruction Decoded",
                                         visible:true,  nbits:"0",  value:0,  default_value:0, draw_data: [] };
	poc_states["DECO_INS"]       = { name:"DECO_INS", verbal: "Instruction decoded in binary",
                                         visible:true,  nbits:"32", value:0,  default_value:0, draw_data: [] };
	poc_states["CLK"]            = { name:"CLK",      verbal: "Clock",
                                         visible:false, nbits:"32", value:0,  default_value:0, draw_data: [] };


	/*
	 *  Signals
	 */

	/* CONTROL UNIT */
	 poc_signals["C"]    = { name: "C",    visible: true, type: "L", value: 0, default_value: 0, nbits: "4",
				behavior: ["MV MUXC_MUXB VAL_ZERO; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB",
					   "MBIT MUXC_MUXB INT 0 1; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB",
					   "MBIT MUXC_MUXB IORDY 0 1; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB",
					   "MBIT MUXC_MUXB MRDY 0 1; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB",
					   "MBIT MUXC_MUXB REG_SR 0 1; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB",
					   "MBIT MUXC_MUXB REG_SR 1 1; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB",
					   "MBIT MUXC_MUXB REG_SR 28 1; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB",
					   "MBIT MUXC_MUXB REG_SR 29 1; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB",
					   "MBIT MUXC_MUXB REG_SR 30 1; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB",
					   "MBIT MUXC_MUXB REG_SR 31 1; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB",
					   "MV MUXC_MUXB INEX; FIRE_IFCHANGED B MUXC_MUXB; RESET_CHANGED MUXC_MUXB"],
				fire_name: ['svg_cu:text3410'],
				draw_data: [['svg_cu:path3108'],
					    ['svg_cu:path3062'],
					    ['svg_cu:path3060'],
					    ['svg_cu:path3136'],
					    ['svg_cu:path3482'],
					    ['svg_cu:path3480'],
					    ['svg_cu:path3488'],
					    ['svg_cu:path3486'],
					    ['svg_cu:path3484'],
					    ['svg_cu:path3484-9'],
					    ['svg_cu:path3108-3','svg_cu:path3260-3-8-6','svg_cu:path3260-3-8','svg_cu:path3260-3']],
				draw_name: [['svg_cu:path3496','svg_cu:path3414','svg_cu:path3194-08']] };
	 poc_signals["B"]   = { name: "B", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["MV A1 MUXC_MUXB; FIRE A1",
					  "NOT_ES A1 MUXC_MUXB; FIRE A1"],
                               depends_on: ["CLK"],
			       fire_name: ['svg_cu:text3408'],
			       draw_data: [['svg_cu:path3094-7'],
					   ['svg_cu:path3392','svg_cu:path3372','svg_cu:path3390','svg_cu:path3384','svg_cu:path3108-1','svg_cu:path3100-8-7']],
			       draw_name: [[],['svg_cu:path3194-0','svg_cu:path3138-8','svg_cu:path3498-6']] };
	 poc_signals["A0"] = { name: "A0", visible: false, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["SBIT A0A1 A0 1; FIRE A0A1",
					  "SBIT A0A1 A0 1; FIRE A0A1"],
                               depends_on: ["CLK"],
			       fire_name: ['svg_cu:text3406'],
			       draw_data: [['svg_cu:path3096'], ['svg_cu:path3096']],
			       draw_name: [[],['svg_cu:path3138-8-1','svg_cu:path3098-2','svg_cu:path3124-2-5']] };
	 poc_signals["A1"] = { name: "A1", visible: false, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["SBIT A0A1 A1 0; FIRE A0A1",
					  "SBIT A0A1 A1 0; FIRE A0A1"],
                               depends_on: ["CLK"],
			       fire_name: [],
			       draw_data: [['svg_cu:path3094'], ['svg_cu:path3094']],
			       draw_name: [[]] };
	 poc_signals["A0A1"] = { name: "A0A1", visible: true, type: "L", value: 0, default_value: 0, nbits: "2",
				behavior: ["PLUS1 MUXA_MICROADDR REG_MICROADDR",
					   "CP_FIELD MUXA_MICROADDR REG_MICROINS/MADDR",
					   "MV MUXA_MICROADDR ROM_MUXA",
					   "MV MUXA_MICROADDR FETCH"],
                                depends_on: ["CLK"],
				fire_name: [],
				draw_data: [['svg_cu:path3102', 'svg_cu:path3100', 'svg_cu:path3098', 'svg_cu:path3100-9', 'svg_cu:path3088'],
					    ['svg_cu:path3104', 'svg_cu:path3134', 'svg_cu:path3500', 'svg_cu:path3416'],
					    ['svg_cu:path3504', 'svg_cu:path3100-8', 'svg_cu:path3234-9'],
					    ['svg_cu:path3124']],
				draw_name: [[]] };

	/* REGISTER LOAD */
	 poc_signals["C0"] = { name: "C0", visible: true, type: "E", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV REG_MAR BUS_IB"],
			       fire_name: ['svg_p:text3077'],
			       draw_data: [['svg_p:path3081']],
			       draw_name: [['svg_p:path3075']] };
	 poc_signals["C1"] = { name: "C1", visible: true, type: "E", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV REG_MBR M1_C1"],
			       fire_name: ['svg_p:text3079'],
			       draw_data: [['svg_p:path3055']],
			       draw_name: [['svg_p:path3073']] };
	 poc_signals["C2"] = { name: "C2", visible: true, type: "E", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV REG_PC BUS_IB; UPDATEDPC"],
			       fire_name: ['svg_p:text3179'],
			       draw_data: [['svg_p:path3217']],
			       draw_name: [['svg_p:path3177']] };
	 poc_signals["C3"] = { name: "C3", visible: true, type: "E", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV REG_IR BUS_IB; DECO; FIRE_IFSET C 10"],
			       fire_name: ['svg_p:text3439'],
			       draw_data: [['svg_p:path3339', 'svg_p:path3913-4']],
			       draw_name: [['svg_p:path3337']] };
	 poc_signals["C4"] = { name: "C4", visible: true, type: "E", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV REG_RT1 BUS_IB"],
			       fire_name: ['svg_p:tspan482'],
			       draw_data: [['svg_p:path3339-4']],
			       draw_name: [['svg_p:path3337-0']] };
	 poc_signals["C7"] = { name: "C7", visible: true, type: "E", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV REG_SR M7_C7; FIRE C"],
			       fire_name: ['svg_p:text3655'],
			       draw_data: [['svg_p:path3651-9']],
			       draw_name: [['svg_p:path3681']] };

	/* TRI-STATES */
	 poc_signals["TA"]  = { name: "TA",  visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV BUS_AB REG_MAR"],
			       fire_name: ['svg_p:text3091'],
			       draw_data: [['svg_p:path3089', 'svg_p:path3597', 'svg_p:path3513', 'svg_p:path3601', 'svg_p:path3601-2', 'svg_p:path3187', 'svg_p:path3087', 'svg_p:path2995','svg_p:path3535']],
			       draw_name: [['svg_p:path3085']] };
	 poc_signals["TD"]  = { name: "TD",  visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV BUS_DB REG_MBR; FIRE R; FIRE W"],
			       fire_name: ['svg_p:text3103'],
			       draw_data: [['svg_p:path3101','svg_p:path3587','svg_p:path3419-8','svg_p:path3071','svg_p:path3099','svg_p:path3097','svg_p:path3559-5','svg_p:path3419-1-0','svg_p:path3583','svg_p:path3419-1','svg_p:path3491','svg_p:path3641','svg_p:path3541']],
			       draw_name: [['svg_p:path3095']] };
	 poc_signals["T1"]  = { name: "T1",  visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV BUS_IB REG_MBR; FIRE M7; FIRE M1"],
			       fire_name: ['svg_p:text3105'],
			       draw_data: [['svg_p:path3071', 'svg_p:path3069','svg_p:path3049','svg_p:path3063-9', 'svg_p:path3071']],
			       draw_name: [['svg_p:path3067']] };
	 poc_signals["T2"]  = { name: "T2",  visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV BUS_IB REG_PC; FIRE M7; FIRE M1"],
			       fire_name: ['svg_p:text3449'],
			       draw_data: [['svg_p:path3199', 'svg_p:path3201','svg_p:path3049']],
			       draw_name: [['svg_p:path3329']] };
	 poc_signals["T3"]  = { name: "T3",  visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV BUS_IB SELEC_T3; FIRE M7; FIRE M1"],
			       fire_name: ['svg_p:text3451'],
			       draw_data: [['svg_p:path3349', 'svg_p:path3931', 'svg_p:path3345','svg_p:path3049']],
			       draw_name: [['svg_p:path3351']] };
	 poc_signals["T6"]  = { name: "T6",  visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV BUS_IB ALU_T6; FIRE M7; FIRE M1"],
			       fire_name: ['svg_p:text3457'],
			       draw_data: [['svg_p:path3589', 'svg_p:path3317', 'svg_p:path3163-2','svg_p:path3049', 'svg_p:path3317-9', 'svg_p:path3321', 'svg_p:path3261-8']],
			       draw_name: [['svg_p:path3319']] };
	 poc_signals["T8"]  = { name: "T8",  visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV BUS_IB REG_SR; FIRE M7; FIRE M1"],
			       fire_name: ['svg_p:text3657'],
			       draw_data: [['svg_p:path3651', 'svg_p:path3647','svg_p:path3049']],
			       draw_name: [['svg_p:path3649']] };
	 poc_signals["T9"]  = { name: "T9",  visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV BUS_IB RA_T9; FIRE M7; FIRE M1"],
			       fire_name: ['svg_p:text3147'],
			       draw_data: [['svg_p:path3143', 'svg_p:path3139','svg_p:path3049','svg_p:path3143-9']],
			       draw_name: [['svg_p:path3133']] };
	 poc_signals["T10"] = { name: "T10", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "MV BUS_IB RB_T10; FIRE M7; FIRE M1"],
			       fire_name: ['svg_p:text3149'],
			       draw_data: [['svg_p:path3145', 'svg_p:path3141','svg_p:path3049','svg_p:path3145-5']],
			       draw_name: [['svg_p:path3137']] };
	 poc_signals["T11"] = { name: "T11", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "CP_FIELD BUS_IB REG_MICROINS/EXCODE; FIRE M7; FIRE M1"],
			       fire_name: ['svg_p:text3147-5','svg_cu:tspan4426'],
			       draw_data: [['svg_p:path3081-3','svg_p:path3139-7','svg_p:path3049','svg_cu:path3081-3','svg_cu:path3139-7','svg_cu:path3502']],
			       draw_name: [['svg_p:path3133-6','svg_cu:path3133-6']] };

	/* MUX. */
	 poc_signals["M1"]  = { name: "M1", visible: true, type: "L",  value: 0, default_value:0, nbits: "1",
			       behavior: ["MV M1_C1 BUS_IB", "MV M1_C1 BUS_DB"],
                               depends_on: ["C1"],
			       fire_name: ['svg_p:text3469'],
			       draw_data: [['svg_p:path3063','svg_p:path3061','svg_p:path3059'], ['svg_p:path3057','svg_p:path3641','svg_p:path3419','svg_p:path3583']],
			       draw_name: [[], ['svg_p:path3447']] };
	 poc_signals["M7"]  = { name: "M7", visible: true, type: "L",  value: 0, default_value:0, nbits: "1",
			       behavior: ["MV M7_C7 BUS_IB", "MV M7_C7 REG_SR; SBIT M7_C7 FLAG_C 31; SBIT M7_C7 FLAG_V 30; SBIT M7_C7 FLAG_N 29; SBIT M7_C7 FLAG_Z 28"],
                               depends_on: ["C7"],
			       fire_name: ['svg_p:text3673'],
			       draw_data: [['svg_p:path3691', 'svg_p:path3693', 'svg_p:path3659'], ['svg_p:path3695']],
			       draw_name: [[], ['svg_p:path3667']] };
	 poc_signals["MA"]  = { name: "MA",  visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["MV MA_ALU RA_T9; FIRE COP", "MV MA_ALU BUS_IB; FIRE COP"],
                               depends_on: ["SELA","SELB"],
			       fire_name: ['svg_p:text3463'],
			       draw_data: [['svg_p:path3249', 'svg_p:path3161', 'svg_p:path3165'], ['svg_p:path3279']],
			       draw_name: [[], ['svg_p:path3423']] };
	 poc_signals["MB"]  = { name: "MB",  visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["MV MB_ALU RB_T10; FIRE COP", "MV MB_ALU REG_PC; FIRE COP"],
                               depends_on: ["SELA","SELB"],
			       fire_name: ['svg_p:text3465'],
			       draw_data: [['svg_p:path3281', 'svg_p:path3171', 'svg_p:path3169'],
                                           ['svg_p:path3283']],
			       draw_name: [[], ['svg_p:path3425', 'svg_p:path3427']] };
	 poc_signals["COP"] = { name: "COP", visible: true, type: "L", value: 0, default_value:0, nbits: "5", forbidden: true,
			       behavior: ["NOP_ALU; UPDATE_NZVC",
                                          "AND ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "OR ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "NOT ALU_T6 MA_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "XOR ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "SRL ALU_T6 MA_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "SRA ALU_T6 MA_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "SL ALU_T6 MA_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "RR ALU_T6 MA_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "RL ALU_T6 MA_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "ADD ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "SUB ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "MUL ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "DIV ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "MOD ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "LUI ALU_T6 MA_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "ADDFOUR ALU_T6 MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "ADDONE ALU_T6 MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "FADD ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "FSUB ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "FMUL ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "FDIV ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "FMOD ALU_T6 MA_ALU MB_ALU; UPDATE_NZVC; FIRE_IFSET T6 1; FIRE_IFSET M7 1",
					  "NOP_ALU",
					  "NOP_ALU",
					  "NOP_ALU",
					  "NOP_ALU",
					  "NOP_ALU",
					  "NOP_ALU",
					  "NOP_ALU",
					  "NOP_ALU",
					  "NOP_ALU"],
                               depends_on: ["SELCOP"],
			       fire_name: ['svg_p:text3303'],
			       draw_data: [['svg_p:path3237', 'svg_p:path3239',
                                            'svg_p:path3261-8', 'svg_p:path3321', 'svg_p:path3901-6', 'svg_p:path3317-9']],
			       draw_name: [['svg_p:path3009', 'svg_p:path3301']] };
	 poc_signals["SELA"] = { name: "SELA", visible: true, type: "L", value: 0, default_value:0, nbits: "6",
			        behavior: ["FIRE_IFCHANGED MR_RA SELA; RESET_CHANGED SELA"],
                                depends_on: ["RA"],
			        fire_name: ['svg_cu:text3164'],
			        draw_data: [[]],
			        draw_name: [[]] };
	 poc_signals["SELB"] = { name: "SELB", visible: true, type: "L", value: 0, default_value:0, nbits: "6",
			        behavior: ["FIRE_IFCHANGED MR_RB SELB; RESET_CHANGED SELB"],
                                depends_on: ["RB"],
			        fire_name: ['svg_cu:text3168'],
			        draw_data: [[]],
			        draw_name: [[]] };
	 poc_signals["SELC"] = { name: "SELC", visible: true, type: "L", value: 0, default_value:0, nbits: "6",
			        behavior: ["FIRE_IFCHANGED MR_RC SELC; RESET_CHANGED SELC"],
                                depends_on: ["RC"],
			        fire_name: ['svg_cu:text3172'],
			        draw_data: [[]],
			        draw_name: [[]] };
	 poc_signals["SELCOP"] = { name: "SELCOP", visible: true, type: "L", value: 0, default_value:0, nbits: "5",
			        behavior: ["FIRE_IFCHANGED MC SELCOP; RESET_CHANGED SELCOP"],
                                depends_on: ["COP"],
			        fire_name: ['svg_cu:text3312'],
			        draw_data: [[]],
			        draw_name: [[]] };
	 poc_signals["EXCODE"] = { name: "EXCODE", visible: true, type: "L", value: 0, default_value:0, nbits: "4",
			          behavior: ["FIRE T11"],
			          fire_name: ['svg_cu:text3312-6'],
			          draw_data: [[]],
			          draw_name: [[]] };

	 poc_signals["RA"]  = { name: "RA", visible: true, type: "L", value: 0, default_value:0, nbits: "6", forbidden: true,
			       behavior: ["GET RA_T9 BR RA; FIRE_IFSET T9 1; FIRE_IFSET MA 0"],
                               depends_on: ["SELA"],
			       fire_name: ['svg_p:text3107'],
			       draw_data: [[]],
			       draw_name: [['svg_p:path3109']] };
	 poc_signals["RB"]  = { name: "RB", visible: true, type: "L", value: 0, default_value:0, nbits: "6", forbidden: true,
			       behavior: ["GET RB_T10 BR RB; FIRE_IFSET T10 1; FIRE_IFSET MB 0"],
                               depends_on: ["SELB"],
			       fire_name: ['svg_p:text3123'],
			       draw_data: [[]],
			       draw_name: [['svg_p:path3113']] };
	 poc_signals["RC"]  = { name: "RC", visible: true, type: "L", value: 0, default_value:0, nbits: "6", forbidden: true,
			       behavior: ["FIRE LC"],
                               depends_on: ["SELC"],
			       fire_name: ['svg_p:text3125'],
			       draw_data: [[]],
			       draw_name: [['svg_p:path3117']] };
	 poc_signals["LC"]  = { name: "LC", visible: true, type: "E", value: 0, default_value:0, nbits: "1",
			       behavior: ["NOP", "SET BR RC BUS_IB"],
			       fire_name: ['svg_p:text3127'],
			       draw_data: [['svg_p:path3153', 'svg_p:path3151', 'svg_p:path3129']],
			       draw_name: [['svg_p:path3121']] };

	 poc_signals["SE"]  = { name: "SE",     visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ["MBITS SELEC_T3 0 REG_RT1 OFFSET SIZE 0 SE; FIRE T3",
			                  "MBITS SELEC_T3 0 REG_RT1 OFFSET SIZE 0 SE; FIRE T3"],
                               depends_on: ["T3"],
			       fire_name: ['svg_p:text3593'],
			       draw_data: [[]],
			       draw_name: [['svg_p:path3591','svg_p:path3447-7-7']] };
	 poc_signals["SIZE"] = { name: "SIZE",   visible: true, type: "L", value: 0, default_value:0, nbits: "5",
			       behavior: ['MBITS SELEC_T3 0 REG_RT1 OFFSET SIZE 0 SE; FIRE T3'],
                               depends_on: ["T3"],
			       fire_name: ['svg_p:text3363'],
			       draw_data: [[]],
			       draw_name: [['svg_p:path3355']] };
	 poc_signals["OFFSET"] = { name: "OFFSET", visible: true, type: "L", value: 0, default_value:0, nbits: "5",
			       behavior: ['MBITS SELEC_T3 0 REG_RT1 OFFSET SIZE 0 SE; FIRE T3'],
                               depends_on: ["T3"],
			       fire_name: ['svg_p:text3707'],
			       draw_data: [[]],
			       draw_name: [['svg_p:path3359']] };

	 poc_signals["MC"]  = { name: "MC", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ['MBIT COP REG_IR 0 5; FIRE_IFCHANGED COP MC',
					  'CP_FIELD COP REG_MICROINS/SELCOP; FIRE_IFCHANGED COP MC'],
                               depends_on: ["SELCOP"],
			       fire_name: ['svg_cu:text3322','svg_cu:text3172-1-5'],
			       draw_data: [['svg_cu:path3320', 'svg_cu:path3142'],['svg_cu:path3318', 'svg_cu:path3502-6', 'svg_cu:path3232-6']],
			       draw_name: [[],['svg_cu:path3306']] }; /*path3210 print red color line of rest of control signals*/

	 poc_signals["MR"]  = { name: "MR", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			       behavior: ['MV MR_RA MR; FIRE MR_RA; MV MR_RB MR; FIRE MR_RB; MV MR_RC MR; FIRE MR_RC',
			                  'MV MR_RA MR; FIRE MR_RA; MV MR_RB MR; FIRE MR_RB; MV MR_RC MR; FIRE MR_RC'],
                               depends_on: ["SELA","SELB","SELC"],
			       fire_name: ['svg_cu:text3222','svg_cu:text3242','svg_cu:text3254','svg_cu:text3172-1'],
			       draw_data: [['svg_cu:path3494','svg_cu:path3492','svg_cu:path3490','svg_cu:path3142b','svg_cu:path3188',
                                            'svg_cu:path3190','svg_cu:path3192','svg_cu:path3194','svg_cu:path3276','svg_cu:path3290',
                                            'svg_cu:path3260','svg_cu:path3196','svg_cu:path3502','svg_cu:path3278','svg_cu:path3232','svg_cu:path3292'],
					   ['svg_cu:path3270','svg_cu:path3282','svg_cu:path3300', 'svg_cu:path3258', 'svg_cu:path3260',
                                            'svg_cu:path3278', 'svg_cu:path3196', 'svg_cu:path3502',
					    'svg_cu:path3294', 'svg_cu:path3292', 'svg_cu:path3288', 'svg_cu:path3232', 'svg_cu:path3280']],
			       draw_name: [[],['svg_cu:path3220','svg_cu:path3240','svg_cu:path3252']] };
	 poc_signals["MR_RA"] = { name: "MR_RA", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			         behavior: ['MBIT_SN RA REG_IR REG_MICROINS/SELA 6; FIRE RA;',
					    'CP_FIELD RA REG_MICROINS/SELA; FIRE RA;'],
			         fire_name: [],
			         draw_data: [[]],
			         draw_name: [[]] };
	 poc_signals["MR_RB"] = { name: "MR_RB", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			         behavior: ['MBIT_SN RB REG_IR REG_MICROINS/SELB 6; FIRE RB;',
					    'CP_FIELD RB REG_MICROINS/SELB; FIRE RB;'],
			         fire_name: [],
			         draw_data: [[]],
			         draw_name: [[]] };
	 poc_signals["MR_RC"] = { name: "MR_RC", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			         behavior: ['MBIT_SN RC REG_IR REG_MICROINS/SELC 6; FIRE RC;',
					    'CP_FIELD RC REG_MICROINS/SELC; FIRE RC;'],
			         fire_name: [],
			         draw_data: [[]],
			         draw_name: [[]] };

	/* I/O Devices */
	 poc_signals["IOR"]   = { name: "IOR", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
				 behavior: ["NOP", "MOVE_BITS KBD_IOR 0 1 IOR; MOVE_BITS SCR_IOR 0 1 IOR; FIRE KBD_IOR; FIRE SCR_IOR"],
				 fire_name: ['svg_p:text3715'],
				 draw_data: [[], ['svg_p:path3733', 'svg_p:path3491', 'svg_p:text3715']],
				 draw_name: [[], []]};
	 poc_signals["IOW"]   = { name: "IOW", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
				 behavior: ["NOP", "MOVE_BITS SCR_IOW 0 1 IOW; FIRE SCR_IOW;"],
				 fire_name: ['svg_p:text3717'],
				 draw_data: [[], ['svg_p:path3735', 'svg_p:path3491', 'svg_p:text3717']],
				 draw_name: [[], []]};

        /* Virtual Signals, for UI */
	 poc_signals["TEST_C"] = { name: "TEST_C", visible: true, type: "L", value: 0, default_value:0, nbits: "1", forbidden: true,
		  	          behavior: ["MV FLAG_C VAL_ZERO; FIRE M7", "MV FLAG_C VAL_ONE; FIRE M7"],
                                  depends_on: ["SELCOP"],
		  	          fire_name: ['svg_p:text3701-3'],
			          draw_data: [['svg_p:text3701-3']],
			          draw_name: [[]] };
	 poc_signals["TEST_V"] = { name: "TEST_V", visible: true, type: "L", value: 0, default_value:0, nbits: "1", forbidden: true,
		  	          behavior: ["MV FLAG_V VAL_ZERO; FIRE M7", "MV FLAG_V VAL_ONE; FIRE M7"],
                                  depends_on: ["SELCOP"],
		  	          fire_name: ['svg_p:text3701-3-1'],
			          draw_data: [['svg_p:text3701-3-1']],
			          draw_name: [[]] };
	 poc_signals["TEST_N"] = { name: "TEST_N", visible: true, type: "L", value: 0, default_value:0, nbits: "1", forbidden: true,
		  	          behavior: ["MV FLAG_N VAL_ZERO; FIRE M7", "MV FLAG_N VAL_ONE; FIRE M7"],
                                  depends_on: ["SELCOP"],
		  	          fire_name: ['svg_p:text3701-3-2'],
			          draw_data: [['svg_p:text3701-3-2']],
			          draw_name: [[]] };
	 poc_signals["TEST_Z"] = { name: "TEST_Z", visible: true, type: "L", value: 0, default_value:0, nbits: "1", forbidden: true,
		  	          behavior: ["MV FLAG_Z VAL_ZERO; FIRE M7", "MV FLAG_Z VAL_ONE; FIRE M7"],
                                  depends_on: ["SELCOP"],
		  	          fire_name: ['svg_p:text3701-3-5'],
			          draw_data: [['svg_p:text3701-3-5']],
			          draw_name: [[]] };
	 poc_signals["TEST_I"] = { name: "TEST_I", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
		  	          behavior: ["MV FLAG_I VAL_ZERO; FIRE M7", "MV FLAG_I VAL_ONE; FIRE M7"],
                                  depends_on: ["CLK"],
		  	          fire_name: ['svg_cu:text3440'],
			          draw_data: [['svg_cu:text3440']],
			          draw_name: [[]] };
	 poc_signals["TEST_U"] = { name: "TEST_U", visible: true, type: "L", value: 0, default_value:0, nbits: "1",
			          behavior: ["MV FLAG_U VAL_ZERO; FIRE M7", "MV FLAG_U VAL_ONE; FIRE M7"],
                                  depends_on: ["CLK"],
			          fire_name: ['svg_cu:text3442'],
			          draw_data: [['svg_cu:text3442']],
			          draw_name: [[]] };


	/*
	 *  Syntax of behaviors
	 */

	poc_behaviors["NOP"]     = { nparameters: 1,
				     operation: function(s_expr) { },
				        verbal: function(s_expr) { return "" ; }
				   };
	poc_behaviors["NOP_ALU"] = { nparameters: 1,
				     operation: function(s_expr)
		                                {
						   poc_update_nzvc(0, 0, 0, 0);
						},
					verbal: function (s_expr)
						{
						   return "Reset ALU flags. " ;
						}
				   };
        poc_behaviors["MV"]      = { nparameters: 3,
                                     types: ["X", "X"],
                                     operation: function(s_expr)
                                                {
						   sim_elto_org = get_reference(s_expr[2]) ;
						   sim_elto_dst = get_reference(s_expr[1]) ;
                                                   newval       = get_value(sim_elto_org) ;
                                                   set_value(sim_elto_dst, newval) ;
                                                },
                                        verbal: function (s_expr)
                                                {
						   var sim_elto_org = get_reference(s_expr[2]) ;
                                                   var newval       = get_value(sim_elto_org) ;

                                                   return "Copy from " + show_verbal(s_expr[2]) +
							  " to " + show_verbal(s_expr[1]) + " value " + show_value(newval) + ". " ;
                                                }
                                   };
        poc_behaviors["LOAD"]    = { nparameters: 3,
                                     types: ["X", "X"],
                                     operation: function(s_expr)
                                                {
						   sim_elto_org = get_reference(s_expr[2]) ;
						   sim_elto_dst = get_reference(s_expr[1]) ;
                                                   newval       = get_value(sim_elto_org) ;
                                                   set_value(sim_elto_dst, newval) ;
                                                },
                                        verbal: function (s_expr)
                                                {
						   var sim_elto_org = get_reference(s_expr[2]) ;
                                                   var newval       = get_value(sim_elto_org) ;

                                                   return "Load from " + show_verbal(s_expr[2]) +
							  " to " + show_verbal(s_expr[1]) + " value " + show_value(newval) + ". " ;
                                                }
                                   };
        poc_behaviors["CP_FIELD"] = { nparameters: 3,
                                     types: ["X", "X"],
                                     operation: function(s_expr)
                                                {
                                                   r = s_expr[2].split('/') ;
						   sim_elto_org = get_reference(r[0]) ;

                                                   newval = get_value(sim_elto_org) ;
						   newval = newval[r[1]] ;
                                                   if (typeof newval != "undefined")
						   {
						       sim_elto_dst = get_reference(s_expr[1]) ;
                                                       set_value(sim_elto_dst, newval);
						   }
                                                },
                                        verbal: function (s_expr)
                                                {
                                                   var r = s_expr[2].split('/') ;
						   var sim_elto_org = get_reference(r[0]) ;

                                                   var newval = get_value(sim_elto_org) ;
						       newval = newval[r[1]] ;
                                                   if (typeof newval == "undefined") {
						       return "" ;
						   }

                                                   return "Copy from Field " + r[1] + " of " + show_verbal(r[0]) +
							  " to " + show_verbal(s_expr[1]) + " value " + show_value(newval) + ". " ;
                                                }
                                   };
	poc_behaviors["NOT_ES"]   = { nparameters: 3,
				     types: ["S", "E"],
				     operation: function (s_expr)
		                                {
						   set_value( poc_signals[s_expr[1]], Math.abs(get_value(poc_states[s_expr[2]]) - 1));
						},
					verbal: function (s_expr)
						{
						   var value = Math.abs(get_value(poc_states[s_expr[2]]) - 1) ;

                                                   return "Set " + show_verbal(s_expr[1]) + " with value " + show_value(value) + " (Logical NOT of " + s_expr[2] + "). " ;
						}
				   };
	poc_behaviors["GET"]     = { nparameters: 4,
				     types: ["E", "E", "S"],
				     operation: function(s_expr)
		                                {
						   set_value(poc_states[s_expr[1]], get_value(poc_states[s_expr[2]][ poc_signals[s_expr[3]].value]));
						},
					verbal: function (s_expr)
						{
						   var value = get_value(poc_states[s_expr[2]][poc_signals[s_expr[3]].value]) ;

                                                   return "Set " + show_verbal(s_expr[1]) + " with value " + show_value(value) + " (Register File " + s_expr[3] + "). " ;
						}
				   };
	poc_behaviors["SET"]     = { nparameters: 4,
				     types: ["E", "S", "E"],
				     operation: function(s_expr)
		                                {
						   set_value(poc_states[s_expr[1]][ poc_signals[s_expr[2]].value], get_value(poc_states[s_expr[3]]));
						},
					verbal: function (s_expr)
						{
						   var value = get_value(poc_states[s_expr[3]]) ;
						   var o_ref = poc_states[s_expr[1]][poc_signals[s_expr[2]].value] ;

						   var o_verbal = o_ref.name ;
						   if (typeof o_ref.verbal != "undefined")
						       o_verbal = o_ref.verbal ;

                                                   return "Copy to " + o_verbal + " the value " + show_value(value) + ". " ;
						}
				   };
	poc_behaviors["AND"]     = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                {
				                   var result = get_value(poc_states[s_expr[2]]) & get_value(poc_states[s_expr[3]]) ;
				                   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
				                   var result = get_value(poc_states[s_expr[2]]) & get_value(poc_states[s_expr[3]]) ;

                                                   return "ALU AND with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["OR"]      = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                {
				                   var result = get_value(poc_states[s_expr[2]]) | get_value(poc_states[s_expr[3]]) ;
				                   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
				                   var result = get_value(poc_states[s_expr[2]]) | get_value(poc_states[s_expr[3]]) ;

                                                   return "ALU OR with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["NOT"]     = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
				                   var result = ~(get_value(poc_states[s_expr[2]])) ;
				                   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
				                   var result = ~(get_value(poc_states[s_expr[2]])) ;

                                                   return "ALU NOT with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["XOR"]     = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                {
				                   var result = get_value(poc_states[s_expr[2]]) ^ get_value(poc_states[s_expr[3]]) ;
				                   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
				                   var result = get_value(poc_states[s_expr[2]]) ^ get_value(poc_states[s_expr[3]]) ;

                                                   return "ALU XOR with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["SRL"]     = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
				                   var result = (get_value(poc_states[s_expr[2]])) >>> 1 ;
				                   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
				                   var result = (get_value(poc_states[s_expr[2]])) >>> 1 ;

                                                   return "ALU Shift Right Logical with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["SRA"]     = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
				                   var result = (get_value(poc_states[s_expr[2]])) >> 1 ;
				                   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
				                   var result = (get_value(poc_states[s_expr[2]])) >> 1 ;

                                                   return "ALU Shift Right Arithmetic with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["SL"]      = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
				                   var result = (get_value(poc_states[s_expr[2]])) << 1 ;
				                   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, (result) >>> 31) ;
						},
					verbal: function (s_expr)
						{
				                   var result = (get_value(poc_states[s_expr[2]])) << 1 ;

                                                   return "ALU Shift Left with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["RR"]      = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
				                   var result = ((get_value(poc_states[s_expr[2]])) >>> 1) | (((get_value(poc_states[s_expr[2]])) & 1) << 31) ;
				                   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
				                   var result = ((get_value(poc_states[s_expr[2]])) >>> 1) | (((get_value(poc_states[s_expr[2]])) & 1) << 31) ;

                                                   return "ALU Right Rotation with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["RL"]      = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
				                   var result = ((get_value(poc_states[s_expr[2]])) << 1) | (((get_value(poc_states[s_expr[2]])) & 0X80000000) >>> 31) ;
				                   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
				                   var result = ((get_value(poc_states[s_expr[2]])) << 1) | (((get_value(poc_states[s_expr[2]])) & 0X80000000) >>> 31) ;

                                                   return "ALU Left Rotation with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["ADD"]     = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                {
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;
						   var result = a + b ;
						   set_value(poc_states[s_expr[1]], result >>> 0) ;

						   var flag_n = (result < 0) ? 1 : 0 ;
						   var flag_z = (result == 0) ? 1 : 0 ;
						   var flag_c = (a >>> 31) && (b >>> 31) ;

						   var flag_v = 0 ;
						   if ( (result < 0) && (a >= 0) && (b >= 0) )
							flag_v = 1 ;
						   if ( (result >= 0) && (a <  0) && (b <  0) )
							flag_v = 1 ;

			                           poc_update_nzvc(flag_n, flag_z, flag_v, flag_c) ;
						},
					verbal: function (s_expr)
						{
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;
						   var result = a + b ;

                                                   return "ALU ADD with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["SUB"]     = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                {
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;
						   var result = a - b ;
						   set_value(poc_states[s_expr[1]], result >>> 0) ;

						   var flag_n = (result < 0) ? 1 : 0 ;
						   var flag_z = (result == 0) ? 1 : 0 ;
						   var flag_c = (a >>> 31) && (b >>> 31) ;

						   var flag_v = 0 ;
						   if ( (result < 0) && (a >= 0) && (b >= 0) )
							flag_v = 1 ;
						   if ( (result >= 0) && (a <  0) && (b <  0) )
							flag_v = 1 ;

			                           poc_update_nzvc(flag_n, flag_z, flag_v, flag_c) ;
						},
					verbal: function (s_expr)
						{
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;
						   var result = a - b ;

                                                   return "ALU SUB with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["MUL"]     = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                {
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;
						   var result = a * b ;
						   set_value(poc_states[s_expr[1]], result >>> 0) ;

						   var flag_n = (result < 0) ? 1 : 0 ;
						   var flag_z = (result == 0) ? 1 : 0 ;
						   var flag_c = 0 ;

						   var flag_v = 0 ;
						   if ( (result < 0) && (a >= 0) && (b >= 0) )
							flag_v = 1 ;
						   if ( (result >= 0) && (a <  0) && (b <  0) )
							flag_v = 1 ;

			                           poc_update_nzvc(flag_n, flag_z, flag_v, flag_c) ;
						},
					verbal: function (s_expr)
						{
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;
						   var result = a * b ;

                                                   return "ALU MUL with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["DIV"]     = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                {
						   var a = (get_value(poc_states[s_expr[2]]) << 0) ;
						   var b = (get_value(poc_states[s_expr[3]]) << 0) ;

						   if (0 == b) {
						       set_value(poc_states[s_expr[1]], 0) ;
			                               poc_update_nzvc(0, 1, 1, 0) ;
                                                       return ;
                                                   }

				                   var result = Math.floor(a / b) ;
				                   set_value(poc_states[s_expr[1]], result) ;
			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;

						   if (0 == b) {
                                                       return "ALU DIV zero by zero (oops!). " ;
						   }

				                   var result = Math.floor(a / b) ;
                                                   return "ALU DIV with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["MOD"]     = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                {
						   var result = (get_value(poc_states[s_expr[2]]) << 0) % (get_value(poc_states[s_expr[3]]) << 0) ;
						   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;

						   var result = a % b ;

                                                   return "ALU MOD with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["LUI"]     = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
						   var result = (get_value(poc_states[s_expr[2]])) << 16 ;
						   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
						   var result = (get_value(poc_states[s_expr[2]])) << 16 ;

                                                   return "ALU Load Upper Immediate with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["ADDFOUR"] = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
						   var result = a + 4 ;
						   set_value(poc_states[s_expr[1]], result >>> 0) ;

						   var flag_n = (result < 0) ? 1 : 0 ;
						   var flag_z = (result == 0) ? 1 : 0 ;
						   var flag_c = (a >>> 31) && (b >>> 31) ;

						   var flag_v = 0 ;
						   if ( (result < 0) && (a >= 0) && (b >= 0) )
							flag_v = 1 ;
						   if ( (result >= 0) && (a <  0) && (b <  0) )
							flag_v = 1 ;

			                           poc_update_nzvc(flag_n, flag_z, flag_v, flag_c) ;
						},
					verbal: function (s_expr)
						{
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
						   var result = a + 4 ;

                                                   return "ALU ADD 4 with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["ADDONE"]  = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
						   var result = a + 1 ;
						   set_value(poc_states[s_expr[1]], result >>> 0) ;

						   var flag_n = (result < 0) ? 1 : 0 ;
						   var flag_z = (result == 0) ? 1 : 0 ;
						   var flag_c = (a >>> 31) && (b >>> 31) ;

						   var flag_v = 0 ;
						   if ( (result < 0) && (a >= 0) && (b >= 0) )
							flag_v = 1 ;
						   if ( (result >= 0) && (a <  0) && (b <  0) )
							flag_v = 1 ;

			                           poc_update_nzvc(flag_n, flag_z, flag_v, flag_c) ;
						},
					verbal: function (s_expr)
						{
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
						   var result = a + 1 ;

                                                   return "ALU ADD 4 with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["FADD"]    = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                { // Dummy code added for testing only...
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;
						   var result = a.toFixed(2) + b.toFixed(2) ;

						   set_value(poc_states[s_expr[1]], result >>> 0) ;

						   var flag_n = (result  < 0.0) ? 1 : 0 ;
						   var flag_z = (result == 0.0) ? 1 : 0 ;
						   var flag_c = 0 ;

						   var flag_v = 0 ;
						   if ( (result < 0.0) && (a >= 0.0) && (b >= 0.0) )
							flag_v = 1 ;
						   if ( (result >= 0.0) && (a <  0.0) && (b <  0.0) )
							flag_v = 1 ;

			                           poc_update_nzvc(flag_n, flag_z, flag_v, flag_c) ;
						},
					verbal: function (s_expr)
						{
						   return "" ; // TODO
						}
				   };
	poc_behaviors["FSUB"]    = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                { // Dummy code added for testing only...
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;
						   var result = a.toFixed(2) - b.toFixed(2) ;
						   set_value(poc_states[s_expr[1]], result >>> 0) ;

						   var flag_n = (result  < 0.0) ? 1 : 0 ;
						   var flag_z = (result == 0.0) ? 1 : 0 ;
						   var flag_c = 0 ;

						   var flag_v = 0 ;
						   if ( (result < 0) && (a >= 0) && (b >= 0) )
							flag_v = 1 ;
						   if ( (result >= 0) && (a <  0) && (b <  0) )
							flag_v = 1 ;

			                           poc_update_nzvc(flag_n, flag_z, flag_v, flag_c) ;
						},
					verbal: function (s_expr)
						{
						   return "" ; // TODO
						}
				   };
	poc_behaviors["FMUL"]    = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                { // Dummy code added for testing only...
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
                                                   var b = get_value(poc_states[s_expr[3]]) << 0 ;
						   var result = a.toFixed(2) * b.toFixed(2) ;
						   set_value(poc_states[s_expr[1]], result >>> 0) ;

						   var flag_n = (result  < 0.0) ? 1 : 0 ;
						   var flag_z = (result == 0.0) ? 1 : 0 ;
						   var flag_c = 0 ;

						   var flag_v = 0 ;
						   if ( (result < 0) && (a >= 0) && (b >= 0) )
							flag_v = 1 ;
						   if ( (result >= 0) && (a <  0) && (b <  0) )
							flag_v = 1 ;

			                           poc_update_nzvc(flag_n, flag_z, flag_v, flag_c) ;
						},
					verbal: function (s_expr)
						{
						   return "" ; // TODO
						}
				   };
	poc_behaviors["FDIV"]    = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                { // Dummy code added for testing only...
						   var a = (get_value(poc_states[s_expr[2]]) << 0) ;
						   var b = (get_value(poc_states[s_expr[3]]) << 0) ;

						   if (0 == b) {
						       set_value(poc_states[s_expr[1]], 0) ;
			                               poc_update_nzvc(0, 1, 1, 0) ;
                                                       return ;
                                                   }

				                   var result = Math.floor(a / b) ;
				                   set_value(poc_states[s_expr[1]], result) ;
			                           poc_update_nzvc((result  < 0.0) ? 1 : 0,
                                                                   (result == 0.0) ? 1 : 0,
                                                                   0,
                                                                   0) ;
						},
					verbal: function (s_expr)
						{
						   return "" ; // TODO
						}
				   };
	poc_behaviors["FMOD"]    = { nparameters: 4,
				     types: ["E", "E", "E"],
				     operation: function(s_expr)
		                                { // Dummy code added for testing only...
						   var result = (get_value(poc_states[s_expr[2]]) << 0) % (get_value(poc_states[s_expr[3]]) << 0) ;
						   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result  < 0.0) ? 1 : 0,
                                                                   (result == 0.0) ? 1 : 0,
                                                                   0,
                                                                   0) ;
						},
					verbal: function (s_expr)
						{
						   return "" ; // TODO
						}
				   };
	poc_behaviors["LUI"]     = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
						   var result = (get_value(poc_states[s_expr[2]])) << 16 ;
						   set_value(poc_states[s_expr[1]], result) ;

			                           poc_update_nzvc((result < 0) ? 1 : 0, (result == 0) ? 1 : 0, 0, 0) ;
						},
					verbal: function (s_expr)
						{
						   var result = (get_value(poc_states[s_expr[2]])) << 16 ;

                                                   return "ALU Load Upper Immediate with result " + show_value(result) + ". " ;
						}
				   };
	poc_behaviors["PLUS1"]   = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
						   var result = a + 1 ;
						   set_value(poc_states[s_expr[1]], result >>> 0) ;
                                                },
                                        verbal: function (s_expr)
                                                {
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
						   var result = a + 1 ;

                                                   return "Add one to " + show_verbal(s_expr[2]) + " and copy to " + show_verbal(s_expr[1]) + " with result " + show_value(result) + ". " ;
                                                }
				   };
	poc_behaviors["PLUS4"]   = { nparameters: 3,
				     types: ["E", "E"],
				     operation: function(s_expr)
		                                {
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
						   var result = a + 4 ;
						   set_value(poc_states[s_expr[1]], result >>> 0) ;
                                                },
                                        verbal: function (s_expr)
                                                {
						   var a = get_value(poc_states[s_expr[2]]) << 0 ;
						   var result = a + 4 ;

                                                   return "Add four to " + show_verbal(s_expr[2]) + " and copy to " + show_verbal(s_expr[1]) + " with result " + show_value(result) + ". " ;
                                                }
				   };
	poc_behaviors["MBIT"]     = { nparameters: 5,
				     types: ["X", "X", "I", "I"],
				     operation: function (s_expr)
		                                {
						   var sim_elto_dst = get_reference(s_expr[1]) ;
						   var sim_elto_org = get_reference(s_expr[2]) ;
						   var offset       = parseInt(s_expr[3]) ;
						   var size         = parseInt(s_expr[4]) ;

						   var n1 = get_value(sim_elto_org).toString(2); // to binary
						   var n2 = "00000000000000000000000000000000".substring(0, 32-n1.length) + n1;
						   n2 = n2.substr(31 - (offset + size - 1), size);

						   set_value(sim_elto_dst, parseInt(n2, 2));
						},
					verbal: function (s_expr)
						{
						   var sim_elto_dst = get_reference(s_expr[1]) ;
						   var sim_elto_org = get_reference(s_expr[2]) ;
						   var offset       = parseInt(s_expr[3]) ;
						   var size         = parseInt(s_expr[4]) ;

						   var n1 = get_value(sim_elto_org).toString(2) ; // to binary
						   var n2 = "00000000000000000000000000000000".substring(0, 32-n1.length) + n1 ;
						       n2 = n2.substr(31 - (offset + size - 1), size) ;
						   var n3 = parseInt(n2, 2) ;

                                                   return "Copy from " + show_verbal(s_expr[2]) + " to " + show_verbal(s_expr[1]) + " value " + show_value(n3) + " (copied " + size + " bits from bit " + offset + "). " ;
						}
				   };
	poc_behaviors["MBIT_SN"]  = { nparameters: 5,
				     types: ["S", "E", "E", "I"],
				     operation: function (s_expr)
		                                {
						   var base = 0;
						   var r = s_expr[3].split('/');
						   if (1 == r.length)
							base = get_value(poc_states[s_expr[3]]);
						   else
						   if (typeof  poc_states[r[0]].value[r[1]] != "undefined")
							base = poc_states[r[0]].value[r[1]];
                                                   // begin: REG_MICROINS/xxx by default is the default_value
					      else if (typeof   poc_signals[r[1]].default_value != "undefined")
						        base =  poc_signals[r[1]].default_value;
					      else if (typeof   poc_states[r[1]].default_value != "undefined")
						        base =  poc_states[r[1]].default_value;
                                                   // end: REG_MICROINS/xxx by default is the default_value
						   else alert('WARN: undefined state/field pair -> ' + r[0] + '/' + r[1]);

						   var offset = parseInt(s_expr[4]) ;

						   var n1 = get_value(poc_states[s_expr[2]]).toString(2); // to binary
						   var n2 = "00000000000000000000000000000000".substring(0, 32 - n1.length) + n1 ;
						   var n3 = n2.substr(31 - (base + offset - 1), offset) ;

						   set_value( poc_signals[s_expr[1]], parseInt(n3, 2));
						},
					verbal: function (s_expr)
						{
						   return "" ; // TODO
						}
				   };
	poc_behaviors["SBIT"]     = { nparameters: 4,
				     types: ["X", "X", "I"],
				     operation: function (s_expr)
		                                {
						   sim_elto_org = get_reference(s_expr[2]) ;
						   sim_elto_dst = get_reference(s_expr[1]) ;

						   //    0      1    2  3
						   //   SBIT  A0A1  A1  0
						   var new_value = (sim_elto_dst.value & ~(1 << s_expr[3])) |
						                         (sim_elto_org.value << s_expr[3]);
						   set_value(sim_elto_dst, (new_value >>> 0));
						},
					verbal: function (s_expr)
                                                {
						   sim_elto_org = get_reference(s_expr[2]) ;
						   sim_elto_dst = get_reference(s_expr[1]) ;

                                                   return "Set bit " + show_verbal(s_expr[3]) + " of " + show_verbal(s_expr[1]) + " to value " + sim_elto_org.value + ". " ;
                                                }
				   };
	poc_behaviors["MBITS"]    = { nparameters: 8,
				     types: ["E", "I", "E", "S", "S", "I", "S"],
				     operation: function(s_expr)
						{
						   var offset = parseInt( poc_signals[s_expr[4]].value) ;
						   var size   = parseInt( poc_signals[s_expr[5]].value) ;

						   var n1 = get_value(poc_states[s_expr[3]]).toString(2); // to binary
						   var n2 = ("00000000000000000000000000000000".substring(0, 32 - n1.length) + n1) ;
						       n2 = n2.substr(31 - (offset + size - 1), size);

						   var n3 =  "00000000000000000000000000000000".substring(0, 32 - n2.length) + n2;
						   if ( ("1" ==  poc_signals[s_expr[7]].value) && ("1" == n2.substr(0, 1)))
                                                   {    // check signed-extension
							n3 = "11111111111111111111111111111111".substring(0, 32 - n2.length) + n2;
						   }

						   set_value(poc_states[s_expr[1]], parseInt(n3, 2));
						},
					verbal: function (s_expr)
						{
						   var offset = parseInt(poc_signals[s_expr[4]].value) ;
						   var size   = parseInt(poc_signals[s_expr[5]].value) ;

						   var n1 = get_value(poc_states[s_expr[3]]).toString(2); // to binary
						   var n2 = ("00000000000000000000000000000000".substring(0, 32 - n1.length) + n1) ;
						       n2 = n2.substr(31 - (offset + size - 1), size);

						   var n3 =  "00000000000000000000000000000000".substring(0, 32 - n2.length) + n2;
						   if ( ("1" ==  poc_signals[s_expr[7]].value) && ("1" == n2.substr(0, 1)))
                                                   {    // check signed-extension
							n3 = "11111111111111111111111111111111".substring(0, 32 - n2.length) + n2;
						   }

						   n1 = parseInt(n3, 2) ;

                                                   return "Copy from " + show_verbal(s_expr[3]) + " to " + show_verbal(s_expr[1]) +
						          " value " + show_value(n1) + " (copied " + size + " bits from bit " + offset + "). " ;
						}
				   };

	poc_behaviors["BSEL"] =  { nparameters: 6,
				     types: ["E", "I", "I", "E", "I"],
				     operation: function (s_expr)
		                                {
						   var posd = parseInt(s_expr[2]) ;
						   var poso = parseInt(s_expr[5]) ;
						   var len  = parseInt(s_expr[3]) ;

						   var n1 = get_value(poc_states[s_expr[4]]).toString(2); // to binary
						   var n2 = "00000000000000000000000000000000".substring(0, 32 - n1.length) + n1 ;
						       n2 = n2.substr(31 - (poso + len) + 1, len);
						   var n3 = "00000000000000000000000000000000".substring(0, 32 - n2.length) + n2;
						   var n4 = "00000000000000000000000000000000".substr(0, posd);
						   n3 = n3 + n4;

						   set_value(poc_states[s_expr[1]], parseInt(n3, 2));
						},
					verbal: function (s_expr)
						{
						   var posd = parseInt(s_expr[2]) ;
						   var len  = parseInt(s_expr[3]) ;
						   var poso = parseInt(s_expr[5]) ;

						   var n1 = get_value(poc_states[s_expr[4]]).toString(2); // to binary
						   var n2 = "00000000000000000000000000000000".substring(0, 32 - n1.length) + n1 ;
						       n2 = n2.substr(31 - (poso + len) + 1, len);
						   var n3 = "00000000000000000000000000000000".substring(0, 32 - n2.length) + n2;
						   var n4 = "00000000000000000000000000000000".substr(0, posd);
						       n3 = n3 + n4;
						   var n5 = parseInt(n3, 2) ;

                                                   return "Copy from " + show_verbal(s_expr[4]) + " to " + show_verbal(s_expr[1]) + " value " + show_value(n5) +
						          " (copied " + len + " bits, from bit " + poso + " of " + s_expr[4] + " to bit " + posd + " of " + s_expr[1] + "). " ;
						}
				   };
	poc_behaviors["EXT_SIG"] =  { nparameters: 3,
				     types: ["E", "I"],
				     operation: function (s_expr)
		                                {
						   var n1 = get_value(poc_states[s_expr[1]]).toString(2); // to binary
						   var n2 = ("00000000000000000000000000000000".substring(0, 32 - n1.length) + n1) ;
						   var n3 = n2.substr(31 - s_expr[2], 31);
						   var n4 = n3;
						   if ("1" == n2[31 - s_expr[2]]) {  // check signed-extension
						       n4 = "11111111111111111111111111111111".substring(0, 32 - n3.length) + n4;
						   }

						   set_value(poc_states[s_expr[1]], parseInt(n4, 2));
						},
					verbal: function (s_expr)
						{
						   var n1 = get_value(poc_states[s_expr[1]]).toString(2); // to binary
						   var n2 = ("00000000000000000000000000000000".substring(0, 32 - n1.length) + n1) ;
						   var n3 = n2.substr(31 - s_expr[2], 31);
						   var n4 = n3;
						   if ("1" == n2[31 - s_expr[2]]) {  // check signed-extension
						       n4 = "11111111111111111111111111111111".substring(0, 32 - n3.length) + n4;
						   }
                                                   var n5 = parseInt(n4, 2) ;

                                                   return "Sign Extension with value " + show_value(n5) + ". " ;
						}
				   };
	poc_behaviors["MOVE_BITS"] =  { nparameters: 5,
				     types: ["S", "I", "I","S"],
				     operation: function (s_expr)
		                                {
						   var posd = parseInt(s_expr[2]) ;
						   var poso = 0 ;
						   var len  = parseInt(s_expr[3]) ;

						   var n1 =  poc_signals[s_expr[4]].value.toString(2); // to binary signal origin
						   n1 = ("00000000000000000000000000000000".substring(0, 32 - n1.length) + n1);
						   n1 = n1.substr(31 - poso - len + 1, len);

						   var n2 =  poc_signals[s_expr[1]].value.toString(2); // to binary signal destiny
						   n2 = ("00000000000000000000000000000000".substring(0, 32 - n2.length) + n2) ;
						   var m1 = n2.substr(0, 32 - (posd + len));
						   var m2 = n2.substr(31 - posd + 1, posd);
						   var n3 = m1 + n1 + m2;

						   set_value( poc_signals[s_expr[1]], parseInt(n3, 2));
						},
					verbal: function (s_expr)
						{
                                                   return "" ;
						}
				   };
	poc_behaviors["MOVE_BITSE"] = {
					  nparameters: 6,
				     types: ["S", "I", "I", "E", "I"],
				     operation: function (s_expr)
		                                {
						   var posd = parseInt(s_expr[2]) ;
						   var poso = parseInt(s_expr[5]) ;
						   var len  = parseInt(s_expr[3]) ;

						   var n1 =  get_value(poc_states[s_expr[4]]).toString(2); // to state signal origin
						   n1 = ("00000000000000000000000000000000".substring(0, 32 - n1.length) + n1);
						   n1 = n1.substr(31 - poso - len + 1, len);

						   var n2 =  poc_signals[s_expr[1]].value.toString(2); // to binary signal destiny
						   n2 = ("00000000000000000000000000000000".substring(0, 32 - n2.length) + n2);
						   var m1 = n2.substr(0, 32 - (posd + len));
						   var m2 = n2.substr(31 - posd + 1, posd);
						   var n3 = m1 + n1 + m2;

						   set_value( poc_signals[s_expr[1]], parseInt(n3, 2));
						},
					verbal: function (s_expr)
						{
						   return "" ;
						}
				  };
	poc_behaviors["DECO"]    = { nparameters: 1,
				     operation: function(s_expr)
						{
						    poc_states['INEX'].value = 0 ;

						    // 1.- IR -> oi
						    var oi = decode_instruction(poc_internal_states.FIRMWARE,
                                                                                poc_ir,
						                                get_value(poc_states['REG_IR'])) ;
						    if (null == oi.oinstruction)
                                                    {
                                                         alert('ERROR: undefined instruction code in firmware (' +
							       'co:'  +  oi.op_code.toString(2) + ', ' +
							       'cop:' + oi.cop_code.toString(2) + ')') ;
							 poc_states['ROM_MUXA'].value = 0 ;
							 poc_states['INEX'].value = 1 ;
							 return -1;
						    }

						    // 2.- oi.oinstruction -> rom_addr
                                                    var rom_addr = oi.op_code << 6;
						    if (typeof oi.oinstruction.cop != "undefined") {
                                                        rom_addr = rom_addr + oi.cop_code ;
						    }

						    // 2.- ! poc_internal_states['ROM'][rom_addr] -> error
						    if (typeof poc_internal_states['ROM'][rom_addr] == "undefined")
						    {
							 alert('ERROR: undefined rom address ' + rom_addr +
                                                               ' in firmware') ;
							 poc_states['ROM_MUXA'].value = 0 ;
							 return -1;
						    }

						    // 3.- poc_internal_states['ROM'][rom_addr] -> mc-start -> ROM_MUXA
						    poc_states['ROM_MUXA'].value = poc_internal_states['ROM'][rom_addr] ;

						    // 4.-  Statistics
						    var val = get_value(poc_states['DECO_INS']) ;
						    set_value(poc_states["DECO_INS"], val + 1);

                                                    // 5.- Update UI
						    var pc = get_value(poc_states['REG_PC']) - 4 ;
                                                    var decins = get_deco_from_pc(pc) ;
						    set_value(poc_states['REG_IR_DECO'], decins) ;
                                                    show_dbg_ir(get_value(poc_states['REG_IR_DECO']));
						},
					verbal: function (s_expr)
						{
                                                   return "Decode instruction. " ;
						}
				   };

		poc_behaviors["FIRE"] = { nparameters: 2,
					     types: ["S"],
					     operation: function (s_expr)
							{
							    // 0.- avoid loops
							    if (poc_internal_states.fire_stack.indexOf(s_expr[1]) != -1) {
								return ;
							    }

							    poc_internal_states.fire_stack.push(s_expr[1]) ;

							    // 1.- update draw
							    update_draw( poc_signals[s_expr[1]],  poc_signals[s_expr[1]].value) ;

							    // 2.- for Level signals, propage it
							    if ("L" ==  poc_signals[s_expr[1]].type)
							    {
								update_state(s_expr[1]) ;
							    }

							    poc_internal_states.fire_stack.pop(s_expr[1]) ;

							    // 3.- check conflicts
                                                            check_buses(s_expr[1]);
							},
						verbal: function (s_expr)
							{
                                                           return "" ;
							}
					   };

		poc_behaviors["FIRE_IFSET"] = { nparameters: 3,
					     types: ["S", "I"],
					     operation: function (s_expr)
							{
                                                            if (get_value( poc_signals[s_expr[1]]) != parseInt(s_expr[2])) {
                                                                return ;
                                                            }

                                                            poc_behaviors["FIRE"].operation(s_expr) ;
							},
						verbal: function (s_expr)
							{
							   return "" ;
							}
					   };

		poc_behaviors["FIRE_IFCHANGED"] = { nparameters: 3,
					     types: ["S", "X"],
					     operation: function (s_expr)
							{
						            sim_elto = get_reference(s_expr[2]) ;
							    if (sim_elto.changed == false)
								return ;

							    poc_behaviors["FIRE"].operation(s_expr) ;
							},
						verbal: function (s_expr)
							{
							   return "" ;
							}
					   };

		poc_behaviors["RESET_CHANGED"] = { nparameters: 2,
					     types: ["X"],
					     operation: function (s_expr)
							{
						            sim_elto = get_reference(s_expr[1]) ;
							    sim_elto.changed = false ; // todo: comment this line
							},
						verbal: function (s_expr)
							{
							   return "" ;
							}
					   };

		poc_behaviors["CLOCK"] = { nparameters: 1,
					     operation: function(s_expr)
							{
							    // 1.- Update counter
							    var val = get_value(poc_states["CLK"]) ;
							    set_value(poc_states["CLK"], val + 1);

							    // 2.- To treat the (Falling) Edge signals
							    for (var i=0; i<jit_fire_order.length; i++) {
								 fn_updateE_now(jit_fire_order[i]) ;
							    }
							    //actions = jit_fire_order.map(fn_updateE_future) ;
							    //Promise.all(actions) ;

							    // 3.- The special (Falling) Edge part of the Control Unit...
							    var new_maddr = get_value(poc_states["MUXA_MICROADDR"]) ;
							    set_value(poc_states["REG_MICROADDR"], new_maddr) ;

							    if (typeof poc_internal_states['MC'][new_maddr] != "undefined")
								     var new_mins = Object.create(poc_internal_states['MC'][new_maddr]);
								else var new_mins = Object.create(poc_states["REG_MICROINS"].default_value);
							    poc_states["REG_MICROINS"].value = new_mins ;

                                                            // 4.- update signals
							    for (var key in poc_signals)
							    {
								 if (typeof new_mins[key] != "undefined")
								      set_value(poc_signals[key],   new_mins[key]);
								 else set_value(poc_signals[key], poc_signals[key].default_value);
							    }

							    // 5.- Finally, 'fire' the (High) Level signals
							    for (var i=0; i<jit_fire_order.length; i++) {
								 fn_updateL_now(jit_fire_order[i]) ;
							    }
							    //actions = jit_fire_order.map(fn_updateL_future) ;
							    //Promise.all(actions) ;

							    // 6.- Native
							         if (typeof new_mins.NATIVE_JIT != "undefined")
							             new_mins.NATIVE_JIT() ;
						            else if (typeof new_mins.NATIVE != "undefined")
							             eval(new_mins.NATIVE) ;
                                                        },
                                                verbal: function (s_expr)
                                                        {
                                                           return "" ;
                                                        }
					   };

		poc_behaviors["RESET"]    = { nparameters: 1,
					     operation: function(s_expr)
							{
							    // set states/signals to the default state
							    for (var key in poc_states) {
								 reset_value(poc_states[key]) ;
                                                            }
							    for (var key in  poc_signals) {
								 reset_value(poc_signals[key]) ;
                                                            }
                                                        },
                                                verbal: function (s_expr)
                                                        {
                                                           return "Reset CPU. " ;
                                                        }
					   };

	poc_behaviors["UPDATEDPC"]     = { nparameters: 1,
				             operation: function(s_expr)
							{
                                                            show_asmdbg_pc();
                                                        },
                                                verbal: function (s_expr)
                                                        {
                                                           return "" ;
                                                        }
					   };

	poc_behaviors["UPDATE_NZVC"]  = { nparameters: 1,
				            operation: function(s_expr)
							{
								/*
							   set_value(simhw_sim_state("FLAG_N"),  
								     poc_internal_states.alu_flags.flag_n);
							   set_value(simhw_sim_state("FLAG_Z"),  
								     poc_internal_states.alu_flags.flag_z);
							   set_value(simhw_sim_state("FLAG_V"),  
								     poc_internal_states.alu_flags.flag_v);
							   set_value(simhw_sim_state("FLAG_C"),  
								     poc_internal_states.alu_flags.flag_c);

							   set_value(simhw_sim_signal("TEST_N"), 
								     poc_internal_states.alu_flags.flag_n);
							   set_value(simhw_sim_signal("TEST_Z"), 
								     poc_internal_states.alu_flags.flag_z);
							   set_value(simhw_sim_signal("TEST_V"), 
								     poc_internal_states.alu_flags.flag_v);
							   set_value(simhw_sim_signal("TEST_C"), 
								     poc_internal_states.alu_flags.flag_c);
								     */

							   update_draw(poc_signals["TEST_N"], poc_signals["TEST_N"].value) ;
							   update_draw(poc_signals["TEST_Z"], poc_signals["TEST_Z"].value) ;
							   update_draw(poc_signals["TEST_V"], poc_signals["TEST_V"].value) ;
							   update_draw(poc_signals["TEST_C"], poc_signals["TEST_C"].value) ;
                                                        },
                                                verbal: function (s_expr)
                                                        {
                                                           return "Update flags N-Z-V-C." ;
							  /*
                                                                  + " to " +
								  poc_internal_states.alu_flags.flag_n + " " +
								  poc_internal_states.alu_flags.flag_z + " " +
								  poc_internal_states.alu_flags.flag_v + " " +
								  poc_internal_states.alu_flags.flag_c + ". " ;
							  */
                                                        }
					   };

