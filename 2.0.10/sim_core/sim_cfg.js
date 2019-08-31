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


        var WSCFG = {} ;
        WSCFG.version = { value:"2.0.10", type:"string"} ;

        function get_cfg ( field )
        {
             return WSCFG[field].value ;
        }

        function set_cfg ( field, value )
        {
             WSCFG[field].value = value ;
        }

        function is_mobile ( )
        {
             if (typeof navigator === "undefined") {
                 return false ;
	     }

             return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ;
        }

        function reset_cfg ( )
        {
	       /*
	        *  base configuration
	        */

	       /*  simulation screen: SVG */
               WSCFG.color_data_active   = { value:"#0066FF",          type:"string"} ;
               WSCFG.color_data_inactive = { value:"rgb(0, 0, 0)",     type:"string"} ; // "black"

               WSCFG.color_name_active   = { value:"red",              type:"string"} ;
               WSCFG.color_name_inactive = { value:"rgb(0, 0, 0)",     type:"string"} ; // "black"

	       WSCFG.size_active         = { value:1.25,               type:"float"} ;
	       WSCFG.size_inactive       = { value:0.02,               type:"float"} ;

               WSCFG.is_byvalue          = { value:false,              type:"boolean"};

	       /* simulation screen: Register File */
               WSCFG.RF_display_format   = { value:'unsigned_16_fill', type:"string"} ;
               WSCFG.RF_display_name     = { value:'numerical',        type:"string"} ;

               WSCFG.is_editable         = { value:true,               type:"boolean"};

	       /* simulation screen: Execution */
               WSCFG.DBG_delay           = { value:5,                  type:"int"} ;
               WSCFG.DBG_level           = { value:"microinstruction", type:"string"} ;

               WSCFG.DBG_limitins        = { value:10000,              type:"int"} ;
               WSCFG.DBG_limitick        = { value:1000,               type:"int"} ;
               WSCFG.ICON_theme          = { value:'classic',          type:"string"} ;

	       /* simulation screen: Notification, etc. */
               WSCFG.NOTIF_delay          = { value:1000,               type:"int"} ;
               WSCFG.CPUCU_size           = { value:6,                  type:"int"} ;
               WSCFG.C1C2_size            = { value:8,                  type:"int"} ;

               WSCFG.SHOWCODE_label       = { value:true,               type:"boolean"} ;
               WSCFG.SHOWCODE_addr        = { value:true,               type:"boolean"} ;
               WSCFG.SHOWCODE_hex         = { value:true,               type:"boolean"} ;
               WSCFG.SHOWCODE_ins         = { value:true,               type:"boolean"} ;
               WSCFG.SHOWCODE_pins        = { value:true,               type:"boolean"} ;

               WSCFG.is_interactive       = { value:true,                            type:"boolean"} ;
               WSCFG.is_quick_interactive = { value:false,                           type:"boolean"} ;
               WSCFG.ws_idiom             = { value:'en',                            type:"string"} ;
               WSCFG.ws_mode              = { value:'newbie',                        type:"string"} ;
               WSCFG.use_voice            = { value:false,                           type:"boolean"} ;
               WSCFG.ws_skin_ui           = { value:'classic',                       type:"string"} ;
               WSCFG.ws_skin_user         = { value:'only_asm:of:only_frequent:of',  type:"string"} ;

	       /* micro/assembly screen: editor */
               WSCFG.editor_theme         = { value:'default',          type:"string"} ;
               WSCFG.editor_mode          = { value:'default',          type:"string"} ;

	       /* misc. */
               WSCFG.verbal_verbose       = { value:'math',             type:"string"} ;
               WSCFG.base_url             = { value:'https://wepsim.github.io/wepsim/ws_dist/wepsim-classic.html',   type:"string"} ;

	       /*
	        *  secondary configuration
	        */

               // some mobile-tuning
               if (is_mobile())
               {
                   WSCFG.NOTIF_delay.value = 2000 ;
                   WSCFG.ICON_theme.value  = 'cat1' ;
                   WSCFG.CPUCU_size.value  = 6 ;
                   WSCFG.C1C2_size.value   = 12 ;
                   WSCFG.ws_skin_ui.value  = 'compact' ;
               }

               // configuration that depends on the previous one
               set_secondary_cfg() ;
        }

        function set_secondary_cfg ( )
        {
            cfg_show_eltos_delay = 100;
            if (get_cfg('DBG_delay') < 5)
                cfg_show_eltos_delay = 350;

            cfg_show_rf_delay = 100;
            if (get_cfg('DBG_delay') < 5)
                cfg_show_rf_delay = 350;

            cfg_show_main_memory_delay = 150;
            if (get_cfg('DBG_delay') < 5)
                cfg_show_main_memory_delay = 450;

            cfg_show_control_memory_delay = 120;
            if (get_cfg('DBG_delay') < 5)
                cfg_show_control_memory_delay = 360;

            cfg_show_asmdbg_pc_delay = 50;
            if (get_cfg('DBG_delay') < 3)
                cfg_show_asmdbg_pc_delay = 150;

            cfg_show_dbg_ir_delay = 100;
            if (get_cfg('DBG_delay') < 5)
                cfg_show_dbg_ir_delay = 300;

            cfg_show_rf_refresh_delay = 30;
            if (get_cfg('DBG_delay') < 5)
                cfg_show_rf_refresh_delay = 120;
        }


        /*
         *  Persistence
         */

        function save_cfg ( )
        {
	   try
	   {
                for (var item in WSCFG) {
                     localStorage.setItem('wepsim_' + item, get_cfg(item));
                }
	   }
           catch(err)
           {
                console.log("WepSIM can not save the configuration in a persistent way on this web browser, found error: \n" + err.message);
	   }

           set_secondary_cfg() ;
        }

        function restore_cfg ( )
        {
           // set primary configuration with default values
           reset_cfg() ;

           if (localStorage === null) {
	       return ;
	   }

           // try to restore primary configuration values from local_storage
           var default_value ;

           for (var item in WSCFG)
           {
                if (item === 'version') {
                    continue;
                }

                default_value = get_cfg(item) ;

                set_cfg(item, localStorage.getItem('wepsim_' + item)) ;
                if (WSCFG[item].type != "string") {
                    set_cfg(item, JSON.parse(get_cfg(item)));
		}

                if (get_cfg(item) === null) {
                    set_cfg(item, default_value) ;
		}
           }

           // set secondary configuration values
           set_secondary_cfg() ;
        }


        /*
         *  update_cfg = set_cfg + ga + save_cfg
         */

        function update_cfg ( field, value )
        {
             WSCFG[field].value = value ;

             // add if recording
             simcore_record_append_new('Set configuration option ' + field + ' to ' + value,
                                       'update_cfg("' + field + '",' + value + ');\n') ;

             ga('send', 'event', 'config',
                'config.' + WSCFG.version.value,
                'config.' + WSCFG.version.value + '.' + field + '.' + value);

             save_cfg() ;
        }

