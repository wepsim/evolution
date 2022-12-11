class HTMLElement { }
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


    /* jshint esversion: 8 */

    /**
     * WepSIM nodejs aux.
     */

    function wepsim_nodejs_retfill ( ok, msg )
    {
        var msg_txt = msg.replace(/<br>/g,        '\n')
                         .replace(/<EOF>/g,       '[eof]')
                         .replace(/<[^>]*>/g,     '') ;

        var ret = {
                     ok:   ok,
                     html: msg,
                     msg:  treatHTMLSequences(msg_txt)
                  } ;

        return ret ;
    }

    var hash_detail_ui = {

	    "SCREEN":         {
		                                  init: simcore_do_nothing_handler,
		                    get_screen_content: function() {
					                   return simcore_native_get_value("SCREEN", "content") ;
				                        },
                                    set_screen_content: function ( screen_content ) {
                                                           simcore_native_set_value("SCREEN", "content", screen_content) ;
							   return screen_content ;
					                }
	                      },

	    "KEYBOARD":       {
		                                  init: simcore_do_nothing_handler,
		                  get_keyboard_content: function () {
							   var readlineSync = require('readline-sync');
							   var keys = readlineSync.question('keyboard> ');
							   keystrokes = keys.toString() ;

                                                           simcore_native_set_value("KBD", "keystrokes", keystrokes) ;
							   return keystrokes ;
						        },
                                  set_keyboard_content: function( keystrokes ) {
                                                           simcore_native_set_value("KBD", "keystrokes", keystrokes) ;
					                   return keystrokes ;
				                        }
	                      }
	} ;

    function wepsim_nodejs_load_jsonfile ( url_json )
    {
       var jstr   = "" ;
       var jobj   = [] ;

       try {
           jstr = fs.readFileSync(url_json, 'utf8') ;
           jobj = JSON.parse(jstr) ;
       }
       catch (e) {
           console.log("Unable to load '" + url_json + "': " + e + ".\n") ;
           jobj = [] ;
       }

       return jobj ;
    }

    function wepsim_nodejs_load_examples ( )
    {
       var jindex = [] ;
       var jobj   = [] ;

       // try to load the index
       var url_example_list = get_cfg('example_url') ;
       jindex = wepsim_nodejs_load_jsonfile(url_example_list) ;

       // try to load each one
       for (var i=0; i<jindex.length; i++)
       {
            jobj = wepsim_nodejs_load_jsonfile(jindex[i].url) ;
            ws_examples = ws_examples.concat(jobj) ;
       }

       return ws_examples ;
    }

    function wepsim_nodejs_show_currentstate ( options )
    {
        var state_obj = simcore_simstate_current2state() ;
        var   ret_msg = simcore_simstate_state2checklist(state_obj, options.purify) ;

	return wepsim_nodejs_retfill(true, ret_msg) ;
    }

    function wepsim_nodejs_show_record ( records )
    {
	var ret_msg = '' ;
	for (var i=0; i<records.length; i++)
	{
	     ret_msg += '[' + i + '] ' + records[i].description + '\n' ;
	}

	return ret_msg ;
    }

    function wepsim_nodejs_show_checkresults ( checklist_ok, newones_too )
    {
	var data3_bin   = simcore_simstate_checklist2state(checklist_ok) ;
	var obj_current = simcore_simstate_current2state();
	var obj_result  = simcore_simstate_check_results(data3_bin, obj_current, newones_too ) ;

	var ret_ok  = (0 == obj_result.errors) ;
        var ret_msg = simcore_simstate_checkreport2txt(obj_result.result) ;
	return wepsim_nodejs_retfill(ret_ok, ret_msg) ;
    }


    // show source listing
    function wepsim_nodejs_header1 ( )
    {
        console.log('pc'          + ','.padEnd(3, '\t') +
                    'instruction' + ','.padEnd(4, '\t')) ;
    }

    function wepsim_nodejs_after_instruction1 ( SIMWARE, reg_pc )
    {
        var curr_mp = simhw_internalState('MP') ;
        if (typeof curr_mp[reg_pc] === 'undefined') {
	    return ;
	}

        var curr_pc = '0x' + reg_pc.toString(16) ;
        var source_line = main_memory_getsrc(curr_mp, reg_pc) ;
	    source_line = source_line.replace(/,/g,"") ;
	var padding2 = 5 - (source_line.length / 7) ;

        console.log('pc = ' + curr_pc + ','.padEnd(2, '\t') +
		          source_line + ','.padEnd(padding2, '\t')) ;
    }


    // show execution progress
    var before_state = null ;
    var  after_state = null ;

    function wepsim_nodejs_header2 ( )
    {
        console.log('pc'          + ','.padEnd(3, '\t') +
                    'instruction' + ','.padEnd(4, '\t') +
                    'changes_from_zero_or_current_value') ;
    }

    function wepsim_nodejs_before_instruction2 ( SIMWARE, reg_pc )
    {
        if (before_state === null)
             before_state = simcore_simstate_current2state() ;
	else before_state = after_state ;
    }

    function wepsim_nodejs_after_instruction2  ( SIMWARE, reg_pc )
    {
        var curr_mp = simhw_internalState('MP') ;
        if (typeof curr_mp[reg_pc] === 'undefined') {
	    return ;
	}

        var curr_pc = '0x' + reg_pc.toString(16) ;
        var source_line = main_memory_getsrc(curr_mp, reg_pc) ;
	    source_line = source_line.replace(/,/g,"") ;

            after_state = simcore_simstate_current2state() ;
        var diff_states = simcore_simstate_diff_states(before_state, after_state) ;

	// padding
	var padding1 = 2 ;
	var padding2 = 5 - (source_line.length / 7) ;

        console.log('pc = ' + curr_pc + ','.padEnd(padding1, '\t') +
		    source_line       + ','.padEnd(padding2, '\t') +
		    diff_states) ;
    }

    function wepsim_nodejs_header3 ( )
    {
        console.log('micropc'     + ','.padEnd(3, '\t') +
                    'microcode'   + ','.padEnd(5, '\t') +
                    'changes_from_zero_or_current_value') ;
    }

    function wepsim_nodejs_before_microinstruction3 ( curr_MC, cur_addr )
    {
        if (before_state === null)
             before_state = simcore_simstate_current2state() ;
	else before_state = after_state ;
    }

    function wepsim_nodejs_after_microinstruction3  ( curr_MC, cur_addr )
    {
	    after_state = simcore_simstate_current2state() ;
	var curr_mpc    = '0x' + cur_addr.toString(16) ;
        var source_line = control_memory_lineToString(curr_MC, cur_addr).trim() ;
	    source_line = source_line.replace(/,/g,"") ;
            source_line = treatHTMLSequences(source_line) ;

	// padding
	var padding1 = 4 - (curr_mpc.length    / 4) ;
	var padding2 = 7 - (source_line.length / 8) ;

	console.log('micropc = ' + curr_mpc + ','.padEnd(padding1, '\t') +
		    source_line             + ','.padEnd(padding2, '\t') +
		    simcore_simstate_diff_states(before_state, after_state)) ;
    }

    function wepsim_nodejs_before_microinstruction4 ( curr_MC, cur_addr )
    {
	var curr_mpc = '0x' + cur_addr.toString(16) ;

	console.log('Micropc at ' + curr_mpc + '.\t' + get_verbal_from_current_mpc()) ;
    }

    // breakpoints
    var breaks  = {} ;
    var mbreaks = {} ;

    function wepsim_nodejs_breakpoints_addrm ( break_list, addr )
    {
	var hexaddr = "0x" + addr.toString(16) ;
	var ret = false ;

        if (break_list == "breaks") {
	    ret = wepsim_execute_toggle_breakpoint(hexaddr) ;
	    console.log('break on ' + hexaddr + ' ' + !ret) ;
            breaks[hexaddr] = true ;
	    if (ret) delete breaks[hexaddr] ;
        }
   else if (break_list == "mbreaks") {
            ret = wepsim_execute_toggle_microbreakpoint(hexaddr) ;
            console.log('mbreak on ' + hexaddr + ' ' + !ret) ;
            mbreaks[hexaddr] = true ;
	    if (ret) delete mbreaks[hexaddr] ;
        }
    }

    function wepsim_nodejs_breakpoints_list ( break_list )
    {
        var eltos = Object.keys(break_list) ;
        if (0 == eltos.length) {
            console.log('no active breakpoints.') ;
            return ;
        }

        console.log('active breaks at: ' + eltos.join(', ')) ;
    }

    // interactive
    function wepsim_nodejs_runInteractiveCmd ( answers, data, options )
    {
        var SIMWARE = get_simware() ;
        var pc_name = simhw_sim_ctrlStates_get().pc.state ;
        var reg_pc  = 0 ;

        var addr    = 0 ;
        var hexaddr = 0 ;
        var on_exit = false ;

        var parts   = answers.cmd.split(' ') ;
	switch(parts[0])
	{
	       case 'help':
		    console.log('help answer begins.') ;

		    // show help
		    console.log('' +
				'Available commands:\n' +
				' * help:   this command.\n' +
				' * exit:   exit from command line.\n' +
				'\n' +
				' * reset:  reset processor.\n' +
				' * run:    run all the instructions.\n' +
				' * next:   execute instruction at assembly level.\n' +
				' * step:   execute instruction at microinstruction level.\n' +
				'\n' +
				' * dump:   show the current state.\n' +
				' * list  <lines>: show <lines> lines of source code.\n' +
				'\n' +
				' * break  <addr>: breakpoint at given hexadecimal address.\n' +
				' * mbreak <addr>: breakpoint at given hex. address at microinst. level.\n' +
				'') ;

		    console.log('help answer ends.') ;
		    break ;

	       case 'quit':
	       case 'exit':
		    console.log('exit answer begins.') ;

		    // exit without asking 'are your sure?'
		    console.log('bYe!') ;

		    console.log('exit answer ends.') ;
                    on_exit = true ;
		    break ;

	       case 'cont':
	       case 'run':
		    console.log('run answer begins.') ;

		    // execute program
		    wepsim_nodejs_verbose_none(options) ;

                    var options2 = Object.assign({}, options) ;
                        options2.verbosity = 0 ;
		    var ret = wepsim_execute_chunk(options2, options2.instruction_limit) ;
		    if (ret.ok == false)
                    {
	                wepsim_nodejs_header2() ;
		        reg_pc = parseInt(get_value(simhw_sim_state(pc_name))) ;
		        wepsim_nodejs_after_instruction2(SIMWARE, reg_pc) ;

		        console.log(ret.msg + '\n' +
		                    "INFO: Execution stopped.") ;
		    }

		    console.log('run answer ends.') ;
		    break ;

	       case 'next':
		    console.log('next answer begins.') ;

		    // execute instruction
		    wepsim_nodejs_verbose_instructionlevel(options) ;
		    reg_pc = parseInt(get_value(simhw_sim_state(pc_name)));
		    wepsim_nodejs_before_instruction2(SIMWARE, reg_pc) ;

		    ret = simcore_execute_microprogram(options) ;
		    if (false === ret.ok) {
			console.log("ERROR: Execution: " + ret.msg + ".\n") ;
		    }

		    reg_pc = parseInt(get_value(simhw_sim_state(pc_name)));
		    wepsim_nodejs_after_instruction2(SIMWARE, reg_pc) ;

		    console.log('next answer ends.') ;
		    break ;

	       case 'step':
		    console.log('step answer begins.') ;

		    // execute microinstruction
		    wepsim_nodejs_verbose_microinstructionlevel(options) ;
		    reg_pc = parseInt(get_value(simhw_sim_state(pc_name)));
		    wepsim_nodejs_before_instruction2(SIMWARE, reg_pc) ;

		    ret = simcore_execute_microprogram(options) ;
		    if (false === ret.ok) {
			console.log("ERROR: Execution: " + ret.msg + ".\n") ;
		    }

	            wepsim_nodejs_header2() ;
		    reg_pc = parseInt(get_value(simhw_sim_state(pc_name)));
		    wepsim_nodejs_after_instruction2(SIMWARE, reg_pc) ;

		    console.log('step answer ends.') ;
		    break ;

	       case 'reset':
		    console.log('reset answer begins.') ;

		    // reset
		    wepsim_nodejs_verbose_none(options) ;
	            before_state = null ;
	            after_state  = null ;

		    ret = simcore_reset() ;
		    if (false === ret.ok) {
			console.log("ERROR: Execution: " + ret.msg + ".\n") ;
		    }

		    console.log('reset answer ends.') ;
		    break ;

	       case 'dump':
		    console.log('dump answer begins.') ;

		    ret = wepsim_nodejs_show_currentstate(options) ;
		    console.log(ret.msg) ;

		    console.log('dump answer ends.') ;
		    break ;

	       case 'break':
		    console.log('break answer begins.') ;

                    if (typeof parts[1] !== 'undefined')
		    {
                        addr = parseInt(parts[1]) ;
                        wepsim_nodejs_breakpoints_addrm('breaks', addr) ;
                    }
                    wepsim_nodejs_breakpoints_list(breaks) ;

		    console.log('break answer ends.') ;
		    break ;

	       case 'mbreak':
		    console.log('mbreak answer begins.') ;

                    if (typeof parts[1] !== 'undefined')
		    {
                        addr = parseInt(parts[1]) ;
                        wepsim_nodejs_breakpoints_addrm('mbreaks', addr) ;
                    }
                    wepsim_nodejs_breakpoints_list(mbreaks) ;

		    console.log('mbreak answer ends.') ;
		    break ;

	       case 'list':
		    console.log('list answer begins.') ;

                    // number of source lines (10 by default)
                    var n_lines = 10 ;
                    if (typeof parts[1] !== 'undefined') {
                        n_lines = parseInt(parts[1]) ;
		    }

                    // start address
		    var pc_value = parseInt(get_value(simhw_sim_state(pc_name))) ;
                    if (typeof parts[2] !== 'undefined') {
		        pc_value = parseInt(parts[2]) ;
		    }

                    // list source code from start address up to number of source lines
	            wepsim_nodejs_header1() ;
                    for (var i=0; i<n_lines; i++)
                    {
                         if (false == simcore_check_if_can_continue2(0, pc_value)) {
                             continue ;
                         }
		         wepsim_nodejs_after_instruction1(SIMWARE, pc_value) ;
		         pc_value += 4 ;
                    }

		    console.log('list answer ends.') ;
		    break ;

	       default:
		    console.log('Unknown ' + answers.cmd + ' command.\n') ;
		    break ;
	}

        // on_exit -> end REPL loop ;
        return on_exit ;
    }


    /**
     * WepSIM nodejs API
     */

    function wepsim_nodejs_init ( data )
    {
        var ret = simcore_init(false) ;
	if (false === ret.ok) {
            return wepsim_nodejs_retfill(false, "ERROR: initialize: " + ret.msg + ".\n") ;
	}

        set_cfg('ws_idiom', data.idiom) ;

        ret = simcore_init_hw(data.mode) ;
	if (false === ret.ok) {
            return wepsim_nodejs_retfill(false, "ERROR: initialize: " + ret.msg + ".\n") ;
	}

        // wepsim_nodejs_load_examples() ;
        simcore_init_ui(hash_detail_ui) ;

	return wepsim_nodejs_retfill(true, "") ;
    }

    function wepsim_nodejs_prepareCode ( data, options )
    {
	// 1) initialize ws
        simcore_reset() ;

	// 2) load firmware
        var ret = simcore_compile_firmware(data.firmware) ;
	if (false === ret.ok)
	{
	    return wepsim_nodejs_retfill(false, "ERROR: Firmware: " + ret.msg) ;
	}

	// 3) load assembly
        ret = simcore_compile_assembly(data.assembly) ;
	if (false === ret.ok)
        {
	    return wepsim_nodejs_retfill(false, "ERROR: Assembly: " + ret.msg) ;
	}

	return wepsim_nodejs_retfill(true, ret.msg) ;
    }

    // execution
    function wepsim_nodejs_runApp ( data, options )
    {
	// 1) initialization
        var ret = wepsim_nodejs_init(data) ;
	if (false === ret.ok) {
	    return wepsim_nodejs_retfill(false, ret.msg + ".\n") ;
	}

	// 2) prepare firmware-assembly
        ret = wepsim_nodejs_prepareCode(data, options) ;
	if (false === ret.ok) {
	    return wepsim_nodejs_retfill(false, ret.msg + ".\n") ;
	}

	// 3) run code
	ret = simcore_execute_program(options) ;
	if (false === ret.ok) {
	    return wepsim_nodejs_retfill(false, "ERROR: Execution: " + ret.msg + ".\n") ;
	}

	// 4) return result
        return ret ;
    }

    function wepsim_nodejs_check ( data, options )
    {
	// 1) compare with expected results
        ret = wepsim_nodejs_show_checkresults(data.result_ok, false) ;
	if (false === ret.ok) {
	    return wepsim_nodejs_retfill(false, "ERROR: Execution: different results: " + ret.msg + "\n") ;
        }

        ret.msg = "OK: Execution: no error reported\n" ;
	return wepsim_nodejs_retfill(true, ret.msg) ;
    }

    async function wepsim_nodejs_runAppInteractive ( data, options )
    {
	// 1) initialization
        var ret = wepsim_nodejs_init(data) ;
	if (false === ret.ok) {
	    return wepsim_nodejs_retfill(false, "ERROR: Assembly: " + ret.msg + ".\n") ;
	}

	// 2) prepare firmware-assembly
        ret = wepsim_nodejs_prepareCode(data, options) ;
	if (false === ret.ok) {
	    return wepsim_nodejs_retfill(false, "ERROR: Assembly: " + ret.msg + ".\n") ;
	}

	// 3) run code
        var fuzzy = require('fuzzy') ;
        var inq = require('inquirer');
            inq.registerPrompt('command',      require('inquirer-command-prompt')) ;
            inq.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt')) ;

	var icommands = [ 'help', 'exit', 'run', 'next', 'step', 'reset', 'dump' ] ;
        var last_cmd  = 'help' ;
        var do_exit   = false ;
        do {
	      await inq.prompt([{
                 // > autocomplete

                 // type:        'autocomplete',
		 // suggestOnly: true,
		 // source:      function(answers, input) {
		 //		     input = input || '' ;
		 //		     return new Promise(function(resolve) {
		 //	    		     setTimeout(function() {
		 //	      			var fuzzyResult = fuzzy.filter(input, icommands) ;
		 //	      			resolve(fuzzyResult.map(function(el) { return el.original; })) ;
		 //	    		     }, 100) ;
		 //			    }) ;
		 // 		},

                 // > command
		    type:    'command',
		    name:    'cmd',
		    message: 'ws> ',
		    validate: (val) => {
		       return val ? true : 'If you don\'t know the available commands, type help for help';
		    },
		    autoCompletion: icommands,
		    default:        last_cmd,
		    context:        0,
		    short:          true
		}]).then((answers) => {
                    do_exit = wepsim_nodejs_runInteractiveCmd(answers, data, options) ;
                    last_cmd = answers.cmd ;
		}).catch((err) => {
		    console.error(err.stack) ;
		}) ;
        } while (do_exit == false) ;

	// 4) return result
        return ret ;
    }

    // verbose mode
    function wepsim_nodejs_verbose_none ( options )
    {
	//before_state = null ;
	//after_state  = null ;
	options.before_instruction      = simcore_do_nothing_handler ;
	options.after_instruction       = simcore_do_nothing_handler ;
	options.before_microinstruction = simcore_do_nothing_handler ;
	options.after_microinstruction  = simcore_do_nothing_handler ;
    }

    function wepsim_nodejs_verbose_instructionlevel ( options )
    {
	wepsim_nodejs_header2() ;

	//before_state = null ;
	//after_state  = null ;
	options.before_instruction      = wepsim_nodejs_before_instruction2 ;
	options.after_instruction       = wepsim_nodejs_after_instruction2 ;
	options.before_microinstruction = simcore_do_nothing_handler ;
	options.after_microinstruction  = simcore_do_nothing_handler ;
    }

    function wepsim_nodejs_verbose_microinstructionlevel ( options )
    {
	wepsim_nodejs_header3() ;

	//before_state = null ;
	//after_state  = null ;
	options.before_instruction      = simcore_do_nothing_handler ;
	options.after_instruction       = simcore_do_nothing_handler ;
	options.before_microinstruction = wepsim_nodejs_before_microinstruction3 ;
	options.after_microinstruction  = wepsim_nodejs_after_microinstruction3 ;
    }

    function wepsim_nodejs_verbose_verbalized ( options )
    {
	//before_state = null ;
	//after_state  = null ;
	options.before_instruction      = simcore_do_nothing_handler ;
	options.after_instruction       = simcore_do_nothing_handler ;
        options.before_microinstruction = wepsim_nodejs_before_microinstruction4 ;
        options.after_microinstruction  = simcore_do_nothing_handler ;
    }

    // help
    function wepsim_nodejs_help_signal ( data, options )
    {
	var key    = data.firmware.toUpperCase() ;
	var signal = simhw_sim_signal(key) ;
	if (typeof signal === "undefined")
        {
	    return wepsim_nodejs_retfill(false, "ERROR: Unknown signal " + key + ".\n") ;
	}

	var input_help = '' ;
	var nvalues    = Math.pow(2, simhw_sim_signal(key).nbits) ;
	if (simhw_sim_signal(key).behavior.length == nvalues)
	{
	    input_help += 'Signal ' + key + ' has ' + nvalues + ' possible value:\n' ;

	    for (var k = 0; k < simhw_sim_signal(key).behavior.length; k++)
	    {
		 str_bolded = '' ;
		 if (k == simhw_sim_signal(key).default_value) {
		     str_bolded = '(default value) ' ;
		 }

		 behav_str = compute_signal_verbals(key, k) ;
		 if ('' == behav_str.trim()) {
		     behav_str = '<without main effect>' ;
		 }

		 n = k.toString(10) ;
		 input_help += ' * ' + n + ' ' + str_bolded + 'for ' + behav_str + '\n' ;
	    }
	}
	else
	{
	    input_help += 'Signal ' + key + ' has a value from 0 up to ' + (nvalues - 1) ;
	}

	return wepsim_nodejs_retfill(true, input_help) ;
    }

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


    /**
     * WepSIM actions
     */

    var hash_action = {} ;
 

    //
    // CHECK
    //
 
    hash_action.CHECK = function(data, options)
    {
        // set verbosity handlers
        options.before_instruction = simcore_do_nothing_handler ;
        options.after_instruction  = simcore_do_nothing_handler ;

        // run...
        var ret = wepsim_nodejs_runApp(data, options) ;
	if (ret.ok === false) {
            console.log(ret.msg);
            return false ;
	}

        // ...and check results
        ret = wepsim_nodejs_check(data, options) ;
        console.log(ret.msg);
        return ret.ok ;
    } ;
 
    //
    // RUN
    //
 
    hash_action.RUN = function(data, options)
    {
        // set verbosity handlers
        options.before_instruction = simcore_do_nothing_handler ;
        options.after_instruction  = simcore_do_nothing_handler ;
 
        // run...
        var ret = wepsim_nodejs_runApp(data, options) ;
	if (ret.ok === false) {
            console.log(ret.msg);
            return false ;
	}

        // ...and show state at the end
        ret = wepsim_nodejs_show_currentstate(options) ;
        console.log(ret.msg);
        return true ;
    } ;
 
    //
    // STEPBYSTEP
    //
 
    hash_action.STEPBYSTEP = function(data, options)
    {
        // set verbosity handlers
        wepsim_nodejs_verbose_instructionlevel(options) ;
 
        // run...
        var ret = wepsim_nodejs_runApp(data, options) ;
	if (ret.ok === false) {
            console.log(ret.msg);
	}

        return ret.ok ;
    } ;
 
    //
    // MICROSTEPBYMICROSTEP
    //
 
    hash_action.MICROSTEPBYMICROSTEP = function(data, options)
    {
        // set verbosity handlers
        wepsim_nodejs_verbose_microinstructionlevel(options) ;
 
        // run...
        var ret = wepsim_nodejs_runApp(data, options) ;
	if (ret.ok === false) {
            console.log(ret.msg);
	}

        return ret.ok ;
    } ;
 
    //
    // MICROSTEPVERBALIZED
    //
 
    hash_action.MICROSTEPVERBALIZED = function(data, options)
    {
        // set verbosity handlers
        wepsim_nodejs_verbose_verbalized(options) ;
 
        // run...
        var ret = wepsim_nodejs_runApp(data, options) ;
	if (ret.ok === false) {
            console.log(ret.msg);
	}

        return ret.ok ;
    } ;
 
    //
    // INTERACTIVE
    //
 
    hash_action.INTERACTIVE = function(data, options)
    {
        console.log('\n' +
                    'WepSIM-cl\n' +
                    '> WepSIM simulator interface for command line.\n' +
                    '\n' +
                    'Interactive mode enabled.\n' +
                    '') ;
 
        // run...
        var ret = wepsim_nodejs_runAppInteractive(data, options) ;
	if (ret.ok === false) {
            console.log(ret.msg);
            return false ;
	}
    } ;
 
    //
    // EXPORT-HARDWARE
    //
 
    hash_action["EXPORT-HARDWARE"] = function(data, options)
    {
        var ret = simcore_hardware_export(data.mode) ;
 
        console.log(ret.msg);
        return ret.ok ;
    } ;
 
    //
    // SHOW-RECORD
    //
 
    hash_action["SHOW-RECORD"] = function(data, options)
    {
        var ret = wepsim_nodejs_show_record(data.record) ;

        console.log(ret) ;
        return true ;
    } ;
 
    //
    // SHOW-MICROCODE
    //
 
    hash_action["SHOW-MICROCODE"] = function(data, options)
    {
        console.log(data.firmware) ;
        return true ;
    } ;
 
    //
    // SHOW-ASSEMBLY
    //
 
    hash_action["SHOW-ASSEMBLY"] = function(data, options)
    {
        console.log(data.assembly) ;
        return true ;
    } ;
 
    //
    // SHOW-MODE
    //
 
    hash_action["SHOW-MODE"] = function(data, options)
    {
        console.log(data.mode) ;
        return true ;
    } ;
 
    //
    // SHOW-CONSOLE
    //
 
    hash_action["SHOW-CONSOLE"] = function(data, options)
    {
        // run...
        var ret = wepsim_nodejs_runApp(data, options) ;
	if (ret.ok === false) {
            console.log(ret.msg);
            return false ;
	}

	// show screen at the end
        ret.msg = get_screen_content() ;
        console.log(ret.msg);
        return true ;
    } ;
 
    //
    // HELP (signal)
    //
 
    hash_action.HELP = function(data, options)
    {
        wepsim_nodejs_init(data) ;
        var ret = wepsim_nodejs_help_signal(data, options) ;
 
        console.log(ret.msg);
        return ret.ok ;
    } ;
 
    //
    // BUILD-CHECKPOINT
    //
 
    hash_action["BUILD-CHECKPOINT"] = function(data, options)
    {
        // pack elements
        var checkpointObj = {
                              "mode":          data.mode,
                              "firmware":      data.firmware,
                              "assembly":      data.assembly,
                              "state_current": {
                                                  time:        Date().toString(),
                                                  title:       '',
                                                  title_short: '',
				                  content:     ''
				               },
                              "state_history": [],
                              "record":        '',
                              "tag":           Date().toString(),
                              "notify":        true
                           } ;

        var checkpointNB  = wepsim_checkpoint_Obj2NB(checkpointObj) ;
        var checkpointStr = JSON.stringify(checkpointNB, null, 2) ;
        console.log(checkpointStr);

        // return ok
        return true ;
    } ;

    /**
     * WepSIM actions
     */

    function wepsim_nodejs_doActionError ( err_action )
    {
        console.log('\n' +
                    'WepSIM-cl\n' +
                    '> WepSIM simulator interface for command line.\n' +
                    '\n' +
                    'For help details please use:\n' +
                    ' ./wepsim.sh -h\n' +
                    '\n' +
                    ' Please check the command-line syntax used.\n' +
                    ' Action ERROR: ' + err_action + '?\n' +
                    '') ;
 
        return false ;
    }

    function wepsim_nodejs_doAction ( data, options )
    {
        var action_f = hash_action[data.action] ;
        if (typeof action_f !== "undefined") {
            return action_f(data, options) ;
        }

        return wepsim_nodejs_doActionError(data.action) ;
    }

    function wepsim_nodejs_loadCheckpoint ( data_checkpoint )
    {
	var obj_checkpoint  = JSON.parse(data_checkpoint) ;
            obj_checkpoint  = wepsim_checkpoint_NB2Obj(obj_checkpoint) ;

        return obj_checkpoint ;
    }


    /**
     * Export API
     */

    module.exports.wepsim_nodejs_doActionError  = wepsim_nodejs_doActionError ;
    module.exports.wepsim_nodejs_doAction       = wepsim_nodejs_doAction ;
    module.exports.wepsim_nodejs_loadCheckpoint = wepsim_nodejs_loadCheckpoint ;
