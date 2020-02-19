/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = (fn) => {
  return function(req, res, next) {
    console.log('Catching Errors...')
    return fn(req, res, next).catch(next)
  }
}

/*
  Not Found Error Handler
  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  console.log('404 Error Function... Url: '+req._parsedUrl.pathname)
  const err = new Error('Not Found')
  err.status = 404
  next(err)
}

/*
  MongoDB Validation Error Handler
  Detect if there are mongodb validation errors that we can nicely show via flash messages
*/
exports.flashValidationErrors = (err, req, res, next) => {
  console.log('flash validation errors err: '+err+'. err.errors: '+err.errors)

  if (!err && !err.errors) { // if there are no validation errors, move to next handler
    console.log('No validation errors. Moving to next.')
    return next(err)
  } else {
    // console.log(Object.keys(err)) => name, message
    if (err.errors) {
      console.log("validation errors found")
      const errorKeys = Object.keys(err.errors)
      errorKeys.forEach(key => req.flash('error', err.errors[key].message))
    } else if (err.message === 'A user with the given username is already registered') {
      req.flash('error', 'That email address is already in use.')
    }
    return res.redirect('back')
  }
}


/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  console.log('dev errors keys: '+Object.keys(err))
  console.log('dev errors err: '+err)
  console.log('dev errors err.status: '+err.status)
  console.log('dev errors err.message: '+err.message)


  err.stack = err.stack || ''
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  }
  res.status(err.status || 500)
  return res.format({
    // Based on the `Accept` http header
    'text/html': () => {
      return res.render('error', errorDetails)
    }, // Form Submit, Reload the page
    'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
  })
}


/*
  Production Error Handler
  No stack traces are leaked to user
*/
exports.productionErrors = (err, req, res, next) => {
  console.log('prod errors err: '+err)

  res.status(err.status || 500)
  return res.render('error', {
    message: err.message,
    error: {}
  })
}
