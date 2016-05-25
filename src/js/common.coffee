window.jQuery = window.$ = require('jquery')
require('bootstrap')

MOBILE_BREAK_POINT = 768

fontSizeDetector = ->
  docEl = document.documentElement
  clientWidth = docEl.clientWidth
  return if !clientWidth
  docEl.style.fontSize = 20 * (clientWidth / 320 ) + 'px'

mobileDetector = ->
  if $(window).width() < MOBILE_BREAK_POINT
    $('body').addClass('mobile-view')
    fontSizeDetector()
  else
    $('body').removeClass('mobile-view')
    document.documentElement.style.fontSize = 20 + 'px'

$(window).on 'resize orientationchange', mobileDetector

mobileDetector()


