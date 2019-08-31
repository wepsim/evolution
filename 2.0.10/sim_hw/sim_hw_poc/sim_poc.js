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
         *  Elemental Processor: Internal
         */

        /* Abstraction */
        var poc_components      = {} ;
        var poc_states          = {} ;
        var poc_events          = {} ;
        var poc_signals         = {} ;
        var poc_behaviors       = {} ;
        var poc_internal_states = {} ;
        var poc_ctrl_states     = {} ;


        /*
         *  Proof-Of-Concept: Public
         */

        var poc_def = {
                       sim_name:            "Proof-Of-Concept Processor",
                       sim_short_name:      "poc",
                       sim_img_processor:   "examples/hardware/poc/images/processor.svg",
                       sim_img_controlunit: "examples/hardware/poc/images/controlunit.svg",
                       sim_img_cpu:         "examples/hardware/poc/images/cpu.svg",

                       components:          poc_components,
                       states:              poc_states,
                       signals:             poc_signals,
                       behaviors:           poc_behaviors,
                       events:              poc_events,

                       internal_states:     poc_internal_states,
                       ctrl_states:         poc_ctrl_states
	             } ;

            simhw_add(poc_def) ;

