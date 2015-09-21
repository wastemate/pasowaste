var wma_viewModel;
$(document).ready(function () {
  var appKey = '6YJjl9Tlu9gml6IR0YfXrOIkY9SxqCfP2bshQELI';
  var jsKey = 'DEIXEICevT5qkR1zQxvj8PVHrvWu4XPKN2QUhhmL';
  wma_viewModel = new viewModel();
  ko.applyBindings(wma_viewModel);
  wastemate.initialize(appKey, jsKey).then(function (categories) {
    //make the app visible
    wma_viewModel.shouldShowWMA(true);
    //make search visible!
    wma_viewModel.show('search');
    //After the search is made visible, hookup live address library to the UI input.
    // wireUpLiveAddress('#street_address', '4160067421270775959');
    setupLiveAddressGoogle(wma_viewModel);
    //Add each of the categories to the UI
    $.each(categories, function (index, category) {
      wma_viewModel.categories.push(category);
    });
    bindViewFormatters();
  }, function (err) {
    //something must not be right!
    console.log(err);
    alert('Unable to connect. Double check the settings!');
    $('#loading').fadeOut();
    $('#initialize').fadeIn();
  });
});