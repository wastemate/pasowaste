var _debug = window._debug || false;
var setupLiveAddressGoogle = function (viewModel) {
  // Google Places Autocomplete
  var options = {
    types: ['address'],
    componentRestrictions: { country: 'us' }
  };
  // first (header) input
  var input = document.getElementById('street_address');
  var autocomplete = new google.maps.places.Autocomplete(input, options);
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    var place = autocomplete.getPlace();
    parseAddress([place], function () {
      viewModel.show('categries');
    });
  });
  
  // second (lightbox) input
  var input2 = document.getElementById('floating_address' );
  if(input2){
    var autocomplete2 = new google.maps.places.Autocomplete( input2, options );

    google.maps.event.addListener( autocomplete2, 'place_changed', function() {
      var place = autocomplete2.getPlace();
      parseAddress( [ place ], function () {
        $('#signUp').modal('hide');
        viewModel.show('categries');
      });
    });
  }
  
  var onAddressSubmitted = function (address) {
    var geo = new google.maps.Geocoder();
    geo.geocode({ address: address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK && results[0] != null) {
        parseAddress(results);
      } else {
        console.log('Something went wrong :(', results, status);
      }
    });
  };
  var parseAddress = function (results, next) {
    var parts = results[0].address_components;
    var address;
    try {
      address = {
        primaryNumber: parts[0] ? parts[0].long_name : null,
        street: parts[0] && parts[1] ? parts[0].long_name + ' ' + parts[1].long_name : null,
        city: parts[2] ? parts[2].long_name : null,
        stateShort: parts[4] ? parts[4].short_name : null,
        zip: parts[6] ? parts[6].long_name : null,
        lat: results[0].geometry.location.lat() || null,
        lon: results[0].geometry.location.lng() || null,
        rdi: ''
      };
      // debugger;
      if (!address.street || !address.primaryNumber || !address.city || !address.stateShort || !address.zip || !address.lat || !address.lon) {
        // missing required info
        alert('Oops. Bad address. Please enter your full address.');
        return;
      }  //TOOD: what's rdi?
    } catch (e) {
      throw e;
      return;
    }
    onParseData(address, next);
  };
  var onParseData = function (address, next) {
    var resetValues = function () {
      viewModel.address('');
      viewModel.serviceAddress('');
      viewModel.serviceCity('');
      viewModel.serviceStateShort('');
      viewModel.serviceZip('');
    };
    viewModel.userLatLon({
      lat: address.lat,
      lon: address.lon
    });
    //Set the viewModel params based on the address
    viewModel.address(address);
    viewModel.serviceAddress(address.street);
    viewModel.serviceCity(address.city);
    viewModel.serviceStateShort(address.stateShort);
    viewModel.serviceZip(address.zip);
    //Kick off the background process to store this address @ Parse for later referencing
    wastemate.createTempAccount(address).then(function (account) {
      if (_debug) {
        console.log(account);
      }
      //Grab the site service day while we're at it
      wastemate.getServiceDayOfWeek().then(function (serviceDays) {
        if (serviceDays.length === 0) {
          resetValues();
          alert('Oh drats, we don\'t have your address configured for online sign up. Call our office to speak to a human. 238-2381');
          return;
        }
        //service days should be an array 
        var service = serviceDays[0];
        viewModel.serviceDay(service.dow);
        $('#lob_address').css('border', '2px solid #007700');
        if (next) {
          next();
          console.log('next');
          return;
        }
        if (_debug) {
          console.log(serviceDays);
        }
      }, function (err) {
        if (_debug) {
          console.log(err);
        }
        $('#lob_address').css('border', '2px solid #FFCCCC');
        resetValues();
        alert('Oh drats, we don\'t have your address configured for online sign up. Call our office to speak to a human. 238-2381');
      });
    });
  };
};