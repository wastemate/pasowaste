

$( document ).ready( function() {

  var className = 'custom-input-label';

  var paddingDefault = '6px 12px';
  var paddingWithLabel = '12px 12px 0px 12px';

  var animationClass = 'slideUp';

  var inputHeight = 50;

  var labelColor = '#BBB';
  var labelFontSize = 12;
  var labelPadding = '6px 12px';

  var showLabel = function( input, show ) {

    var labelElement = $( input ).parent().find( 'label' );

    if ( show ) {

      $( labelElement )
        .css( 'display', '' );

      $( input ).css( 'padding', paddingWithLabel, 'important' );

    } else {
      
      $( labelElement ).css( 'display', 'none' );
      $( input ).css( 'padding', paddingDefault, 'important' );
    
    }
  };
  
  //add special method to the window class.
  window.invalidateAllInputs = function() {
    $( 'input[placeholder][type=text]' ).each( function() {
        showLabel( this, !!$( this ).val().length );
    } );
  };
  

  $( 'input[placeholder][type=text]' ).each( function() {


    $( this )
      .css( 'height', inputHeight )
      .css( 'padding', paddingDefault );

    var placeholderText = $( this ).attr( 'placeholder' );

    $( '<label/>', {
      text: placeholderText,
      class: className
    } )
      .css( 'font-weight', 'bold' )
      .css( 'color', labelColor )
      .css( 'font-size', labelFontSize )
      .css( 'padding', labelPadding )
      .css( 'position', 'absolute' )
      .css( 'visibility', 'hidden' )
      .addClass( animationClass )
      .insertBefore( $( this ) );

    $( this ).on( 'keyup', function() {

      if ( $( this ).val().length ) {
        showLabel( this, true );
      } else {
        showLabel( this, false );
      }

    } );

  } );

} );