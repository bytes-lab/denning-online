materialAdmin 

  // =========================================================================
  // CALENDAR WIDGET
  // =========================================================================

  .directive('fullCalendar', function(){
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.fullCalendar({
          contentHeight: 'auto',
          theme: true,
          header: {
            right: '',
            center: 'prev, title, next',
            left: ''
          },
          defaultDate: '2014-06-12',
          editable: true,
          events: [
            {
              title: 'All Day',
              start: '2014-06-01',
              className: 'bgm-cyan'
            },
            {
              title: 'Long Event',
              start: '2014-06-07',
              end: '2014-06-10',
              className: 'bgm-orange'
            },
            {
              id: 999,
              title: 'Repeat',
              start: '2014-06-09',
              className: 'bgm-lightgreen'
            },
            {
              id: 999,
              title: 'Repeat',
              start: '2014-06-16',
              className: 'bgm-blue'
            },
            {
              title: 'Meet',
              start: '2014-06-12',
              end: '2014-06-12',
              className: 'bgm-teal'
            },
            {
              title: 'Lunch',
              start: '2014-06-12',
              className: 'bgm-gray'
            },
            {
              title: 'Birthday',
              start: '2014-06-13',
              className: 'bgm-pink'
            },
            {
              title: 'Google',
              url: 'http://google.com/',
              start: '2014-06-28',
              className: 'bgm-bluegray'
            }
          ]
        });
      }
    }
  })
  

  // =========================================================================
  // MAIN CALENDAR
  // =========================================================================

  .directive('calendar', function($compile){
    return {
      restrict: 'A',
      scope: {
        select: '&',
        actionLinks: '=',
      },
      link: function(scope, element, attrs) {
        
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        //Generate the Calendar
        element.fullCalendar({
          header: {
            right: '',
            center: 'prev, title, next',
            left: ''
          },

          theme: true, //Do not remove this as it ruin the design
          selectable: true,
          selectHelper: true,
          editable: true,

          //Add Events
          events: [
            {
              title: 'Court (2)',
              start: new Date(y, m, 1),
              allDay: true,
              className: 'bgm-green'
            },
            {
              title: 'Office (1)',
              start: new Date(y, m, 10),
              allDay: true,
              className: 'bgm-orange'
            },
            {
              title: 'Personal (5)',
              start: new Date(y, m, 18),
              allDay: true,
              className: 'bgm-blue'
            },
            {
              title: 'Court (3)',
              start: new Date(y, m, 20),
              allDay: true,
              className: 'bgm-green'
            },
            {
              title: 'Office (2)',
              start: new Date(y, m, 5),
              allDay: true,
              className: 'bgm-orange'
            },
            {
              title: 'Office (4)',
              start: new Date(y, m, 21),
              allDay: true,
              className: 'bgm-orange'
            },
            {
              title: 'Personal (3)',
              start: new Date(y, m, 5),
              allDay: true,
              className: 'bgm-blue'
            },
            {
              title: 'Court (2)',
              start: new Date(y, m, 5),
              allDay: true,
              className: 'bgm-green'
            },
            {
              title: 'Personal (7)',
              start: new Date(y, m, 1),
              allDay: true,
              className: 'bgm-blue'
            },
            {
              title: 'Office (1)',
              start: new Date(y, m, 15),
              allDay: true,
              className: 'bgm-orange'
            },
            {
              title: 'Personal (2)',
              start: new Date(y, m, 25),
              allDay: true,
              className: 'bgm-blue'
            },
            {
              title: 'Office (6)',
              start: new Date(y, m, 30),
              allDay: true,
              className: 'bgm-orange'
            },
            {
              title: 'Court (2)',
              start: new Date(y, m, 30),
              allDay: true,
              className: 'bgm-green'
            },
          ],

          //On Day Select
          select: function(start, end, allDay) {
            scope.select({
              start: start, 
              end: end
            });
          }
        });
        
          
        //Add action links in calendar header
        element.find('.fc-toolbar').append($compile(scope.actionLinks)(scope));
      }
    }
  })
  

  //Change Calendar Views
  .directive('calendarView', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', function(){
          $('#calendar').fullCalendar('changeView', attrs.calendarView);  
        })
      }
    }
  })

