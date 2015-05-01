(function () {
    var gulp = require('gulp'),
        util = require('gulp-util'),
        open = require('gulp-open'),
        shell = require('gulp-shell');

    //Consts
    const PLUGIN_NAME = 'gulp-iis-express';

    //main gulp plugin function
    function gulpIISExpress(config){

        if(!config){
            throw new util.PluginError(PLUGIN_NAME, "Config is missing!");
        }
        if(!config.configFile){
            config.configFile = "";
        }
        if(!config.sitePaths){
            config.sitePaths = [];
        }
        if(!config.appPools){
            config.appPools = [];
        }
        if(!config.startUrl || config.startUrl == ""){
            throw new util.PluginError(PLUGIN_NAME, "StartUrl must be provided");
        }
        if(!config.browser || config.browser == ""){
            config.browser = "chrome";
        }
        if(!config.sysTray){
            config.sysTray = true;
        }
        if(!config.iisExpressPath || config.iisExpressPath == ""){
            config.iisExpressPath = "C:\\Program Files (x86)\\IIS Express"
        }
        return gulp.src('/index.html')
            .pipe(open('', {
                url: config.startUrl,
                app: config.browser
            }))
            .pipe(startSites(config))
            .on('error', util.log);
    }

    //starting the sites.
    function startSites(config){

        config.sitePaths.forEach(function(item){
            var cmd = 'iisexpress /site:"'  + item + '"';

            if(config.configFile !== ""){
                cmd += '/configFile:"' + config.configFile + '"';
            }
            
            if (config.sysTray){
                cmd += ' /systray:true';
            }else{
                cmd += ' /systray:false';
            }

            gulp.src('')
                .pipe(shell([
                    cmd
                ],{
                    cwd: config.iisExpressPath
                }))
                .on('error', util.log);
        });

        config.appPools.forEach(function(item){
            var cmd = 'iisexpress /apppool:"' + item + '"';

            if(config.configFile !== ""){
                cmd += '/configFile:"' + config.configFile + '"';
            }
            
            if (config.sysTray){
                cmd += ' /systray:true';
            }else{
                cmd += ' /systray:false';
            }

            gulp.src('')
                .pipe(shell([
                    cmd
                ],{
                    cwd: config.iisExpressPath
                }))
                .on('error', util.log);
        });

        return gulp.src('');
    }

    //Exporting the plugin main function
    module.exports = gulpIISExpress;
})();
