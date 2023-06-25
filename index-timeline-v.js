
//JSON Object
var timeline_data1 = [
    {
        time: '2015-09-15',
        body: [{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light mb-2' },
            content: '<a href="1.0.10/" class="mx-auto">WepSIM 1.0.10</a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container d-flex w-100 mx-0 bg-warning' },
            content: 'The initial release',
        },{
            tag: 'img',
            attr: {
		src:      '1.0.10.jpg',
                cssclass: 'img-responsive img-fluid py-3',
		style:    'max-width:85vw !important;',
		alt:      'screenshot of the wepsim 1.0.10'
            }
        }]
    },
    {
        time: '2016-12-11',
        body: [{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light mb-2' },
            content: '<a href="1.7.2/" class="mx-auto">WepSIM 1.7.2</a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container d-flex w-100 mx-0 bg-warning' },
            content: 'Improved UI and faster execution speed',
        },{
            tag: 'img',
            attr: {
		src:      '1.7.2.jpg',
                cssclass: 'img-responsive img-fluid py-3',
		style:    'max-width:85vw !important;',
		alt:      'screenshot of the wepsim 1.7.2'
            }
        }]
    },
    {
        time: '2017-12-10',
        body: [{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light mb-2' },
            content: '<a href="1.8.2/" class="mx-auto">WepSIM 1.8.2</a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container d-flex w-100 mx-0 bg-warning' },
            content: 'Initial support for command line, and the "state" management is added',
        },{
            tag: 'img',
            attr: {
		src:      '1.8.2.jpg',
                cssclass: 'img-responsive img-fluid py-3',
		style:    'max-width:85vw !important;',
		alt:      'screenshot of the wepsim 1.8.2'
            }
        }]
    },
    {
        time: '2018-11-25',
        body: [{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light mb-2' },
            content: '<a href="1.9.3/" class="mx-auto">WepSIM 1.9.3</a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container d-flex w-100 mx-0 bg-warning' },
            content: 'Support for several processors added, command line improvements, and updated Web UI'
        },{
            tag: 'img',
            attr: {
		src:      '1.9.3.jpg',
                cssclass: 'img-responsive img-fluid py-3',
		style:    'max-width:85vw !important;',
		alt:      'screenshot of the wepsim 1.9.3'
            }
        }]
    },
    {
        time: '2019-11-20',
        body: [{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light mb-2' },
            content: '<a href="2.0.10/" class="mx-auto">WepSIM 2.0.10</a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container d-flex w-100 mx-0 bg-warning' },
            content: 'Introduction of checkpoint, pre-load, and recording support, plus many additional improvements'
        },{
            tag: 'img',
            attr: {
		src:      '2.0.10.jpg',
                cssclass: 'img-responsive img-fluid py-3',
		style:    'max-width:85vw !important;',
		alt:      'screenshot of the wepsim 2.0.10'
            }
        }]
    },
    {
        time: '2020-10-26',
        body: [{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light mb-2' },
            content: '<a href="2.1.2/" class="mx-auto">WepSIM 2.1.2</a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container d-flex w-100 mx-0 bg-warning' },
            content: 'Example sets, revised UI based on WebComponents, plus many additional improvements<br>'
        },{
            tag: 'img',
            attr: {
		src:      '2.1.2.jpg',
                cssclass: 'img-responsive img-fluid py-3',
		style:    'max-width:85vw !important;',
		alt:      'screenshot of the wepsim 2.1.2'
            }
        }]
    },
    {
        time: '2021-12-20',
        body: [{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light mb-2' },
            content: '<a href="2.1.6/" class="mx-auto">WepSIM 2.1.6</a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container d-flex w-100 mx-0 bg-warning' },
            content: 'Added 3D-Led device, RISC-V examples, reworked memory detail panel<br>'
        },{
            tag: 'img',
            attr: {
		src:      '2.1.6.jpg',
                cssclass: 'img-responsive img-fluid py-3',
		style:    'max-width:85vw !important;',
		alt:      'screenshot of the wepsim 2.1.6'
            }
        }]
    },
    {
        time: '2022-12-10',
        body: [{
            tag: 'h4',
            attr: { cssclass: 'container d-flex w-100 bg-light mb-2' },
            content: '<a href="2.2.0/" class="mx-auto">WepSIM 2.2.0</a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container d-flex w-100 mx-0 bg-warning' },
            content: 'New Hardware Performance Counter, updated examples, bootstrap 5.2.x<br>'
        },{
            tag: 'img',
            attr: {
		src:      '2.2.0.png',
                cssclass: 'img-responsive img-fluid py-3',
		style:    'max-width:85vw !important;',
		alt:      'screenshot of the wepsim 2.2.0'
            }
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
            content: '<a href="2.2.2/" class="mx-auto">WepSIM 2.2.2<i class="ml-2 fas fa-external-link-alt"></i></a>'
        },{
            tag: 'h5',
            attr: { cssclass: 'container w-100 mx-0 bg-warning' },
            content: 'Several minor updates for 2.2.0<br>'
        }]
    }
];


$(document).ready(function () {

    var timeline_cfg1 = {
		           // effect: "tada",
                           // showGroup: true,
                           effect: 'zoomInUp',
		           language: "en-us",
		           sortDesc: false,
                           showMenu: false,
                           sortDesc:  true
		        } ;

    $("#ws_evolution").albeTimeline(timeline_data1, timeline_cfg1) ;

});

