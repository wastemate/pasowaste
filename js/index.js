var wma_viewModel;
$(document).ready(function () {
  var appKey = 'RRfEslWKdFjN1u5Ui1FDo8SKuixewcvE8qSsR5It';
  var jsKey = 'EmixBK6qQ3MmUK8jPsSVzQKq5K9gLpqPMK8dk909';
  wma_viewModel = new viewModel();
  ko.applyBindings(wma_viewModel);
  wastemate.initialize(appKey, jsKey).then(function (categories) {
    //make the app visible
    wma_viewModel.shouldShowWMA(true);
    //make search visible!
    wma_viewModel.show('search');
    
    //Allow CSRs to use this for cash and check accounts
    wma_viewModel.skipValidateCC = true;
    wastemate._private.ccOnly = false;
    
    //After the search is made visible, hookup live address library to the UI input.
    // wireUpLiveAddress('#street_address', '4160067421270775959');
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