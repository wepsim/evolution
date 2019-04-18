#!/bin/sh
set -x

# skeleton
                    mkdir -p ws_dist
                    touch    ws_dist/index.html
                    mkdir -p ws_dist/external
                    touch    ws_dist/external/index.html
cp external/jquery.min.js    ws_dist/external

#  hardware model + software model + core (simulation ctrl + UI)
cat sim_hw/sim_hw_index.js \
    sim_hw/sim_hw_values.js \
    sim_hw/sim_hw_behavior.js \
    sim_hw/sim_hw_ep/sim_ep.js \
    sim_hw/sim_hw_ep/sim_hw_board.js \
    sim_hw/sim_hw_ep/sim_hw_cpu.js \
    sim_hw/sim_hw_ep/sim_hw_mem.js \
    sim_hw/sim_hw_ep/sim_hw_io.js \
    sim_hw/sim_hw_ep/sim_hw_kbd.js \
    sim_hw/sim_hw_ep/sim_hw_scr.js \
    sim_hw/sim_hw_poc/sim_poc.js \
    sim_hw/sim_hw_poc/sim_hw_board.js \
    sim_hw/sim_hw_poc/sim_hw_cpu.js \
    sim_hw/sim_hw_poc/sim_hw_mem.js \
    sim_hw/sim_hw_poc/sim_hw_io.js \
    sim_hw/sim_hw_poc/sim_hw_kbd.js \
    sim_hw/sim_hw_poc/sim_hw_scr.js \
    sim_sw/sim_lang.js \
    sim_sw/sim_lang_firm.js \
    sim_sw/sim_lang_asm.js \
    sim_core/sim_cfg.js \
    sim_core/sim_core_ctrl.js \
    sim_core/sim_core_ui.js \
    sim_core/sim_api_core.js \
    sim_core/sim_api_native.js \
    sim_core/sim_api_stateshots.js \
    sim_core/sim_core_ui_registers.js \
    sim_core/sim_core_ui_console.js \
    sim_core/sim_core_ui_memory.js \
    sim_core/sim_core_ui_io.js \
    sim_core/sim_core_ui_hw.js \
    sim_core/sim_core_ui_voice.js \
    sim_core/sim_core_ui_help.js \
    sim_core/sim_core_ui_notify.js > ws_dist/sim_all.js
/usr/bin/yui-compressor -o ws_dist/min.sim_all.js ws_dist/sim_all.js
rm -fr ws_dist/sim_all.js

#  WepSIM web engine
cat wepsim/i18n/i18n.js \
    \
    wepsim/i18n/es-gui.js \
    wepsim/i18n/es-tutorial-welcome.js \
    wepsim/i18n/es-tutorial-simpleusage.js \
    wepsim/i18n/es-tour-intro.js \
    wepsim/i18n/es-cfg.js \
    wepsim/i18n/es-help.js \
    wepsim/i18n/es-examples.js \
    \
    wepsim/i18n/en-gui.js \
    wepsim/i18n/en-tutorial-welcome.js \
    wepsim/i18n/en-tutorial-simpleusage.js \
    wepsim/i18n/en-tour-intro.js \
    wepsim/i18n/en-cfg.js \
    wepsim/i18n/en-help.js \
    wepsim/i18n/en-examples.js \
    \
    wepsim/wepsim_breakpointicons.js \
    wepsim/wepsim_example.js \
    wepsim/wepsim_help.js \
    wepsim/wepsim_config.js \
    wepsim/wepsim_config_commands.js \
    wepsim/wepsim_tutorial.js \
    wepsim/wepsim_state.js \
    wepsim/wepsim_url.js \
    wepsim/wepsim_voice.js \
    wepsim/wepsim_voice_commands.js \
    wepsim/wepsim_execute.js \
    wepsim/wepsim_ws_simulator.js \
    wepsim/wepsim_ws_editor.js \
    wepsim/wepsim_misc.js > ws_dist/wepsim_web.js
/usr/bin/yui-compressor -o ws_dist/min.wepsim_web.js ws_dist/wepsim_web.js
rm -fr ws_dist/wepsim_web.js

#  WepSIM nodejs engine
cat ws_dist/min.sim_all.js \
    ws_dist/min.wepsim_web.js \
    wepsim/wepsim_node.js > ws_dist/min.wepsim_node.js

#  external
cat external/popper.min.js \
    external/bootstrap.min.js \
    external/knockout-3.4.2.js \
    external/jquery.knob.min.js \
    external/bootbox.min.js \
    external/spectrum.min.js \
    external/timbre.min.js \
    external/codemirror/codemirror.js \
    external/codemirror/codemirror.javascript.js \
    external/codemirror/codemirror.gas.js \
    external/codemirror/codemirror.keymap/sublime.js \
    external/codemirror/codemirror.keymap/emacs.js \
    external/codemirror/codemirror.keymap/vim.js \
    external/codemirror/codemirror.edit/matchbrackets.js \
    external/codemirror/codemirror.fold/foldcode.js \
    external/codemirror/codemirror.fold/foldgutter.js \
    external/codemirror/codemirror.fold/brace-fold.js \
    external/codemirror/codemirror.fold/xml-fold.js \
    external/codemirror/codemirror.fold/comment-fold.js \
    external/codemirror/codemirror.fold/indent-fold.js \
    external/codemirror/codemirror.fold/markdown-fold.js \
    external/codemirror/codemirror.show-hint/codemirror.show-hint.js \
    external/codemirror/codemirror.runmode/colorize.js \
    external/vis/vis.min.js \
    external/vis/vis-network.min.js \
    external/async.js \
    external/bootstrap-tokenfield.js \
    external/introjs/introjs.min.js \
    external/speech-input.js \
    external/annyang.min.js \
    external/speechkitt/speechkitt.min.js \
    external/dropify/dropify.min.js \
    external/fontawesome/brands.min.js \
    external/fontawesome/solid.min.js > ws_dist/min.external.js

cat external/bootstrap.min.css \
    external/bootstrap-theme.min.css \
    external/spectrum.min.css \
    external/codemirror/codemirror.css \
    external/codemirror/codemirror.theme/blackboard.css \
    external/codemirror/codemirror.fold/foldgutter.css \
    external/codemirror/codemirror.show-hint/codemirror.show-hint.css \
    external/vis/vis.min.css \
    external/vis/vis-network.min.css \
    external/bootstrap-tokenfield.css \
    external/introjs/introjs.min.css \
    external/speech-input.css \
    external/dropify/dropify.min.css \
    external/fontawesome/all.css > ws_dist/min.external.css

mkdir -p ws_dist/external/fontawesome/
   touch ws_dist/external/fontawesome/index.html
cp    -a external/fontawesome/webfonts  ws_dist/external/fontawesome
                                  touch ws_dist/external/fontawesome/webfonts/index.html
cp    -a external/dropify               ws_dist/external/
                                  touch ws_dist/external/dropify/index.html
cp    -a external/speechkitt            ws_dist/external/
                                  touch ws_dist/external/speechkitt/index.html

#  examples, docs, etc.
cp -a examples  ws_dist/
cp -a docs      ws_dist/
cp -a images    ws_dist/
cp -a help      ws_dist/

#  user interface
cp   wepsim/wepsim-classic.html   ws_dist/index.html
cp   wepsim/wepsim-classic.html   ws_dist/wepsim-classic.html
cp   wepsim/wepsim-compact.html   ws_dist/wepsim-compact.html
cp   wepsim/wepsim_pwa.js         ws_dist/min.wepsim_pwa.js

cp manifest.webapp        ws_dist/
cp wepsim/wepsim_node.sh  ws_dist/
chmod a+x ws_dist/*.sh

