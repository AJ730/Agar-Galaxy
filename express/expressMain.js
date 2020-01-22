//express stuff
const app = require('../servers').app;
const ejs = require('ejs');
const path = require('path');

app.set('view engine','ejs');
app.set('views','views');


app.get('/',(req,res,next)=> {
  res.sendFile(path.join(__dirname, '../public/game.html'));
});

app.use((req,res,next)=> {
    res.status(404).render(path.join(__dirname,'../views/404.ejs'), {pageTitle:"Error",error:'404 not Found'});
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render(path.join(__dirname,'../views/404.ejs'));
  });
  

