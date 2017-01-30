$(document).ready(function () {
  var wma_viewModel = new viewModel();
  _wastemate['viewModel'] = wma_viewModel;
  ko.applyBindings(wma_viewModel);
  wastemate.initialize(_wastemate['APP_KEY'], _wastemate['JS_KEY']).then(function (categories) {
    //make the app visible
    if(_wastemate['ui']['widget'] == false){
      wma_viewModel.shouldShowWMA(true);  
    }
    //make search visible!
    wma_viewModel.show('search');
    
    //check if setting was configured & apply default if necessary
    if(_wastemate['REQUIRE_CC'] === undefined){
      _wastemate['REQUIRE_CC'] = true;
    }
    
    if(_wastemate.site.baseUrl === undefined){
        _wastemate.site.baseUrl = '';
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
 
  //Set the default button if not provided
  if(_wastemate['ui']['button'] === undefined){
    _wastemate['ui']['button'] = 'wastemate-service-order';
  }
  $('.' + _wastemate['ui']['button']).on('click', function(){
   var button = $(this);
   var guid = button.data("serviceGuid");
   var line = button.data("serviceLine");
   wma_viewModel.buttonOrderService(guid, line);   
   //todo:show modal
  });
  
  //on load, check if we have a pending order already
  var queryService = qs['s'];
  var queryLine = qs['l'];
  
  if(queryService && queryLine){
    wma_viewModel.buttonOrderService(queryService, queryLine);
  } else if(queryLine){
    wma_viewModel.buttonOrderService(null, queryLine);
  }
});

var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));