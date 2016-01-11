$(document).ready(function () {
  var wma_viewModel = new viewModel();
  _wastemate['viewModel'] = wma_viewModel;
  ko.applyBindings(wma_viewModel);
  wastemate.initialize(_wastemate['APP_KEY'], _wastemate['JS_KEY']).then(function (categories) {
    //make the app visible
    wma_viewModel.shouldShowWMA(true);
    //make search visible!
    wma_viewModel.show('search');
    
    //check if setting was configured & apply default if necessary
    if(_wastemate['REQUIRE_CC'] === undefined){
      _wastemate['REQUIRE_CC'] = true;
    }
    
    wastemate._private.ccRequired = _wastemate['REQUIRE_CC'];
    wma_viewModel.skipValidateCC = !wastemate._private.ccRequired;
    
    setupLiveAddressGoogle(wma_viewModel);
    //Add each of the categories to the UI
    $.each(categories, function (index, category) {
      //prepare to hide recurring categories if the address is not in a recurring territory
      if(category.isRecurring){
        category.isVisible = false; 
      } else {
        category.isVisible = true;  
      }
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
  
  //register back detection
  window.onhashchange = function(){
   wma_viewModel.previous(); 
  }
});