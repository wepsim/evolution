
//JSON Object
var timeline_data2 = [
    {
        time: '2025-11-28',
        body: [{
            tag: 'img',
            attr: {
                src:      '2.3.6.png',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 2.3.6'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="https://wepsim.github.io/wepsim-2.3.6/" class="mx-auto">WepSIM 2.3.6<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'New assembly compiler, several minor improvements<br>'
        }]
    },
    {
        time: '2024-02-05',
        body: [{
            tag: 'img',
            attr: {
                src:      '2.3.0.png',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 2.3.0'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="https://wepsim.github.io/wepsim-2.3.0/" class="mx-auto">WepSIM 2.3.0<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'Initial new version of RV CPU and the new-generation assembly compiler (in beta)<br>'
        }]
    },
    {
        time: '2023-02-22',
        body: [{
            tag: 'img',
            attr: {
                src:      '2.2.2.png',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 2.2.2'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="https://wepsim.github.io/wepsim-2.2.2/" class="mx-auto">WepSIM 2.2.2<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'Several minor updates for 2.2.0<br>'
        }]
    },
    {
        time: '2022-12-10',
        body: [{
            tag: 'img',
            attr: {
                src:      '2.2.0.png',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 2.2.0'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="https://wepsim.github.io/wepsim-2.2.0/" class="mx-auto">WepSIM 2.2.0<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'New Hardware Performance Counter, updated examples, bootstrap 5.2.x<br>'
        }]
    },
    {
        time: '2021-12-20',
        body: [{
            tag: 'img',
            attr: {
                src:      '2.1.6.jpg',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 2.1.6'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="https://wepsim.github.io/wepsim-2.1.6/" class="mx-auto">WepSIM 2.1.6<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'Added 3D-Led device, RISC-V examples, reworked memory detail panel<br>'
        }]
    },
    {
        time: '2020-10-26',
        body: [{
            tag: 'img',
            attr: {
                src:      '2.1.2.jpg',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 2.1.2'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="2.1.2/" class="mx-auto">WepSIM 2.1.2<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'Example sets, revised UI based on WebComponents, among other improvements.'
        }]
    },
    {
        time: '2019-11-20',
        body: [{ 
            tag: 'img',
            attr: {
                src:      '2.0.10.jpg',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 2.0.10'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="2.0.10/" class="mx-auto">WepSIM 2.0.10<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'Introduction of checkpoint, pre-load, and recording support.'
        }]
    }
];

var timeline_data1 = [
    {
        time: '2018-11-25',
        body: [{ 
            tag: 'img',
            attr: {
                src:      '1.9.3.jpg',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 1.9.3'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="1.9.3/" class="mx-auto">WepSIM 1.9.3<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'Support for several CPUs added, command-line and Web UI improvements.'
        }]
    },
    {
        time: '2017-12-10',
        body: [{
            tag: 'img',
            attr: {
                src:      '1.8.2.jpg',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 1.8.2'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="1.8.2/" class="mx-auto">WepSIM 1.8.2<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'Initial support for command line, and the "state" management is added.',
        }]
    },
    {
        time: '2016-12-11',
        body: [{
            tag: 'img',
            attr: {
                src:      '1.7.2.jpg',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 1.7.2'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="1.7.2/" class="mx-auto">WepSIM 1.7.2<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'Improved UI and faster execution speed.<br>',
        }]
    },
    {
        time: '2015-09-15',
        body: [{
            tag: 'img',
            attr: {
                src:      '1.0.10.jpg',
                cssclass: 'img-responsive img-fluid py-0 my-2 zoom',
                alt:      'screenshot of the wepsim 1.0.10'
            }
        },{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light py-2' },
            content: '<a href="1.0.10/" class="mx-auto">WepSIM 1.0.10<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 mb-2 bg-warning' },
            content: 'The initial release. <br><br>',
        }]
    },
];


$(document).ready(function () {

    var timeline_cfg2 = {
		           // effect: "tada",
                           // effect: 'zoomInUp',
                           showGroup: false,
                           showMenu:  false,
		           sortDesc:  false,
		           language:  "en-us",
                           sortDesc:  true
		        } ;

    $("#ws_evolution_2").albeTimeline(timeline_data2, timeline_cfg2) ;

    var timeline_cfg1 = {
		           // effect: "tada",
                           // effect: 'zoomInUp',
                           showGroup: false,
                           showMenu:  false,
		           sortDesc:  false,
		           language:  "en-us",
                           sortDesc:  true
		        } ;

    $("#ws_evolution_1").albeTimeline(timeline_data1, timeline_cfg1) ;

});

