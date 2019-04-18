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


    tour_steps.en = [
                        // 0
			{
			   intro: "Welcome to WepSIM!<br>" +
                                  "WepSIM helps to better understand how a computer works.<br>" +
                                  "<br>" +
                                  "This brief tour introduces the interface for the key elements.",
			   do_before: function () {
			                  return true ;
			              }
			},
                        // 1
			{
			   element: '#select4',
                           intro: "This button on the top-right let users choose the 'execution mode'.<br>" +
                                  "<br>" +
                                  "For example, the hardware to work with (e.g. the elemental processor or EP).<br>" +
                                  "Or the tutorial mode, recommended at the beginning.",
			   do_before: function ()
	                              {
                                          simui_select_main('ep') ;
					  tour.refresh() ;
			                  return true ;
			              }
			},
                        // 2
			{
			   element: '#btn_help1',
                           intro: "On the top-right, the 'help' button opens the associated dialog.<br>" +
                                  "<br>" +
                                  "The help dialog summarizes the tutorials, descriptions, information, etc.",
			   position: 'auto',
			   do_before: function ()
	                              {
					tour.refresh() ;
			                return true ;
			              }
			},
                        // 3
			{
			   element: '#btn_example1',
                           intro: "And on the left, the 'examples' button open the example dialog.<br>" +
                                  "<br>" +
                                  "There are many examples that can be used to learn incrementally.",
			   position: 'auto',
			   do_before: function ()
	                              {
					tour.refresh() ;
			                return true ;
			              }
			},
                        // 4
			{
			   element: '#btn_cfg1',
                           intro: "On the top-left, the 'configuration' button opens the configuration dialog.<br>" +
                                  "<br>" +
                                  "It let users to adapt several aspects of the execution, user interface, preferences, etc.",
			   position: 'auto',
			   do_before: function ()
	                              {
					  tour.refresh() ;
			                  return true ;
			              }
			},
                        // 5
			{
                           intro: "Congrat! You know the key elements in the WepSIM interface.<br>" +
                                  "From the 'Help' dialog you can access the 'Welcome tutorial' to continue learning.<br>",
			   position: 'auto',
			   do_before: function ()
	                              {
					tour.refresh() ;
			                return true ;
			              }
			}
		    ] ;

