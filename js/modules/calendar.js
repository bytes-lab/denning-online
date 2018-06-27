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

  .directive('calendar', function($compile, courtdiaryService, uibDateParser){
    return {
      restrict: 'A',
      scope: {
        select: '&',
        actionLinks: '=',
      },
      link: function(scope, element, attrs) {
        courtdiaryService.getList(1, 100).then(function(res) {
          var eventObj = {};
          angular.forEach(res.data, function(value, key) {
            if (value.clsCourtPlace.strTypeE) {
              if (value.dtEventDate in eventObj) {
                event = eventObj[value.dtEventDate];
                if (value.clsCourtPlace.strTypeE in event) {
                  event[value.clsCourtPlace.strTypeE]++;
                } else {
                  event[value.clsCourtPlace.strTypeE] = 1;
                }
              } else {
                eventObj[value.dtEventDate] = {};
                eventObj[value.dtEventDate][value.clsCourtPlace.strTypeE] = 1;
              }
            }
          })

          var events = [],
              colors = {
                'Land Office': 'bgm-blue',
                'High Court': 'bgm-green',
                'Magistrates Court': 'bgm-gray',
                'Sessions Court': 'bgm-teal',
                'Small Estate Department': 'bgm-pink',
                'Federal Court': 'bgm-purple',
                'Court of Appeal': 'bgm-cyan'
              };

          angular.forEach(eventObj, function(value, date) {
            angular.forEach(value, function(count, event) {
              var color;
              if (event in colors) {
                color = colors[event];
              } else {
                color = 'bgm-brown';
              }

              events.push({
                  title: '['+count+'] '+event,
                  start: uibDateParser.parse(date, 'yyyy-MM-dd HH:mm:ss'),
                  allDay: true,
                  className: color
              })
            })
          })
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
            events: events,
            
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
        });
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

