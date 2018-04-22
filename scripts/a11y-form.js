// upgrade input.button[type="submit"] into button
;(function () {
  var liveRegion = new OnDemandLiveRegion({ level: 'assertive' })

  qs('input.button[type="submit"]').forEach(function (el) {
    var attrs = el.attributes
    var attrsArray = Array.prototype.slice.call(attrs)
    var button = document.createElement('button')
    attrsArray.forEach(function (attr) {
      if (attr.name !== 'value') {
        button.setAttribute(attr.name, attr.value)
      } else {
        button.textContent = attr.value
      }
    })
    el.parentNode.replaceChild(button, el)
  })

  qs('input:not([aria-required])').forEach(function (input) {
    input.setAttribute('aria-required', true)
  })

  Array.prototype.slice.call(document.forms).forEach(function (form) {
    form.addEventListener('submit', function () {
      // clean up inputs
      qs('input[aria-errormessage]').forEach(function (input) {
        input.removeAttribute('aria-errormessage')
        input.removeAttribute('aria-invalid')
      })

      // annouce the first error
      setTimeout(function () {
        var errors = qs('.field-error')
        if (errors.length) {
          liveRegion.say(
            errors.reduce(function (str, err) {
              str += err.textContent
              str += '\n'
              return str
            }, '')
          )
        }

        // try to match errors to inputs
        errors.forEach(function (err) {
          var input = err.parentNode.querySelector('input')
          if (input && err.parentNode !== input.form) {
            err.id = (input.name || input.id) + '-error'
            input.setAttribute('aria-errormessage', err.id)
            input.setAttribute('aria-invalid', true)
          }
        })
      }, 1000)
    })
  })

  function qs (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector))
  }

  function OnDemandLiveRegion (options) {
    options = options || {}

    // The default settings for the module.
    this.settings = {
      level: 'polite',
      parent: 'body',
      idPrefix: 'live-region-',
      delay: 0
    }

    // Overwrite defaults where they are provided in options
    for (var setting in options) {
      if (options.hasOwnProperty(setting)) {
        this.settings[setting] = options[setting]
      }
    }

    // Cast parent as DOM node
    this.settings.parent = document.querySelector(this.settings.parent)
  }

  // 'Say' method
  OnDemandLiveRegion.prototype.say = function (thingToSay, delay) {
    // Get rid of old live region if it exists
    var oldRegion =
      this.settings.parent.querySelector(
        '[id^="' + this.settings.idPrefix + '"]'
      ) || false
    if (oldRegion) {
      this.settings.parent.removeChild(oldRegion)
    }

    // Did an override level get set?
    delay = delay || this.settings.delay

    // Create fresh live region
    this.currentRegion = document.createElement('span')
    this.currentRegion.id =
      this.settings.idPrefix + Math.floor(Math.random() * 10000)

    // Determine redundant role
    var role = this.settings.level !== 'assertive' ? 'status' : 'alert'

    // Add role and aria-live attribution
    this.currentRegion.setAttribute('aria-live', this.settings.level)
    this.currentRegion.setAttribute('role', role)

    // Hide live region element, but not from assistive technologies
    this.currentRegion.setAttribute(
      'style',
      'clip: rect(1px, 1px, 1px, 1px); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px'
    )

    // Add live region to its designated parent
    this.settings.parent.appendChild(this.currentRegion)

    // Populate live region to trigger it
    window.setTimeout(
      function () {
        this.currentRegion.textContent = thingToSay
      }.bind(this),
      delay
    )

    return this
  }
})()
