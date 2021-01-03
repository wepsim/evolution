
//JSON Object
var timeline_data1 = [
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
    }
];


$(document).ready(function () {

    var timeline_cfg1 = {
		           // effect: "tada",
                           // effect: 'zoomInUp',
                           showGroup: false,
                           showMenu:  false,
		           sortDesc:  false,
		           language:  "en-us"
		        } ;

    $("#ws_evolution").albeTimeline(timeline_data1, timeline_cfg1) ;

});

