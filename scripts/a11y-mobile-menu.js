;(function () {
  // trap focus in mobile links
  var container = document.querySelector('.Mobile-overlay')
  var tabStops = Array.prototype.slice.call(
    container.querySelectorAll('a, button')
  )
  var first = tabStops[0]
  var last = tabStops[tabStops.length - 1]
  container.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && e.target === first) {
        e.preventDefault()
        last.focus()
      }
      if (!e.shiftKey && e.target === last) {
        e.preventDefault()
        first.focus()
      }
    }
    // Escape key closes
    if (e.key === 'Escape') {
      last.dispatchEvent(new Event('click'))
    }
  })

  // make all triggers aware of aria-expanded
  // focus the first link when nav opens
  // focus the trigger when nav closes
  var triggers = Array.prototype.slice.call(
    document.querySelectorAll('[data-controller="MobileOverlayToggle"]')
  )
  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      setTimeout(function () {
        var isOpen = document.body.classList.contains(
          'is-mobile-overlay-active'
        )
        triggers.forEach(function (trigger) {
          trigger.setAttribute('aria-expanded', isOpen)
        })
        if (isOpen) {
          first.focus()
        } else {
          triggers[0].focus()
        }
      }, 0)
    })
  })
})()
