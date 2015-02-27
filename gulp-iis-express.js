(function () {
    var gulp = require('gulp'),
        util = require('gulp-util'),
        open = require('gulp-open'),
        shell = require('gulp-shell');

    //Consts
    const PLUGIN_NAME = 'gulp-iis-express';

    //main gulp plugin function
    function gulpIISExpress(config){
      return gulp.src('./index.html')
          .pipe(open('', {
              url: config.startUrl,
              app: config.browser
          }))
          .pipe(startSites(config));
    }

    //starting the sites.
    function startSites(config){
        if(config.iisExpressPath == ""){
            config.iisExpressPath = "C:\\Program Files (x86)\\IIS Express"
        }

        config.sitePaths.forEach(function(item){
            var cmd = 'iisexpress /site:"'  + item + '"';

            if(config.configFile !== ""){
                cmd += '/configFile:"' + config.configFile + '"';
            }

            gulp.src('')
                .pipe(shell([
                    cmd
                ],{
                    cwd: config.iisExpressPath
                }))
        });
		
		config.appPools.foreach(function(item){
			var cmd = 'iisexpress /apppool:"' + item + '"';

            if(config.configFile !== ""){
                cmd += '/configFile:"' + config.configFile + '"';
            }

            gulp.src('')
                .pipe(shell([
                    cmd
                ],{
                    cwd: config.iisExpressPath
                }))
		});
    }

    //Exporting the plugin main function
    module.exports = gulpIISExpress;
})();
