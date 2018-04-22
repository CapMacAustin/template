;(function () {
  qa('.sqs-svg-icon--wrapper').forEach(function (el) {
    if (el.dataset.a11y) return
    el.dataset.a11y = true
    el.setAttribute('aria-label', el.classList[1] || 'social network')
    if (el.target === '_blank') {
      el.setAttribute('rel', 'noopener noreferrer')
    }
  })

  qa('a[target="_blank"]:not([data-a11y])').forEach(function (el) {
    el.dataset.a11y = true
    el.setAttribute('rel', 'noopener noreferrer')
  })

  function qa (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector))
  }
})()
