$(document).ready(function () {
  const amenities = [];
  const amenitiesNames = [];
  $('.amenities li :checkbox').change(function () {
    if (this.checked) {
      amenities.push($(this).attr('data-id'));
      amenitiesNames.push($(this).attr('data-name'));
    } else {
      amenities.splice($.inArray($(this).attr('data-id'), amenities), 1);
      amenitiesNames.splice($.inArray($(this).attr('data-name'), amenitiesNames), 1);
    }
    $('.amenities h4').html(amenitiesNames.join(', '));
  });

  const states = [];
  const statesNames = [];
  $('h2 :checkbox').change(function () {
    if (this.checked) {
      states.push($(this).attr('data-id'));
      statesNames.push($(this).attr('data-name'));
    } else {
      states.splice($.inArray($(this).attr('data-id'), states), 1);
      statesNames.splice($.inArray($(this).attr('data-name'), statesNames), 1);
    }
    $('.locations h4').html(statesNames.join(', '));
  });

  const cities = [];
  $('.cities :checkbox').change(function () {
    if (this.checked) {
      cities.push($(this).attr('data-id'));
      statesNames.push($(this).attr('data-name'));
    } else {
      cities.splice($.inArray($(this).attr('data-id'), cities), 1);
      statesNames.splice($.inArray($(this).attr('data-name'), statesNames), 1);
    }
    $('.locations h4').html(statesNames.join(', '));
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $('.filters button').click(function () {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({ states: states, cities: cities, amenities: amenities }),
      success: function (data) {
        $('section.places').empty();
        data.forEach(function (place) {
          let html = '';
          html += '    <article>';
          html += '      <div class="title_box">';
          html += '        <h2>' + place.name + '</h2>';
          html += '        <div class="price_by_night">$' + place.price_by_night + '</div>';
          html += '      </div>';
          html += '      <div class="information">';
          html += '        <div class="max_guest">' + place.max_guest + ' Guest';
          if (place.max_guest !== 1) {
            html += 's';
          }
          html += '</div>';
          html += '            <div class="number_rooms">' + place.number_rooms + ' Bedroom';
          if (place.number_rooms !== 1) {
            html += 's';
          }
          html += '</div>';
          html += '            <div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom';
          if (place.number_bathrooms !== 1) {
            html += 's';
          }
          html += '</div>';
          html += '      </div>';
          html += '          <div class="description">';
          html += '        ' + place.description;
          html += '          </div>';
          html += '          <div class="reviews">';
          html += '          <h2>Reviews</h2>';
          html += '          <span loaded="false" data-id=' + place.id + '>Show</span>';
          html += '          <ul>';
          html += '          </ul>';
          html += '          </div>';
          html += '    </article>';
          $('section.places').append($(html));
        });
      }
    });
  });
  $(document).on('click', '.reviews span', function () {
    if ($(this).text() === 'Hide') {
      $(this).next().addClass('hide');
      $(this).text('Show');
    } else {
      $(this).text('Hide');
      $(this).next().removeClass('hide');
      if ($(this).attr('loaded') === 'false') {
        const html = [];
        const ul = $(this).next();
        $(this).attr('loaded', 'true');
        $.get('http://0.0.0.0:5001/api/v1/places/' + $(this).attr('data-id') + '/reviews', function (data) {
          data.forEach(function (review) {
            html.push('<li>' + review.text + '</li>');
          });
          $(ul).append(html.join(''));
        });
      }
    }
  });
});
