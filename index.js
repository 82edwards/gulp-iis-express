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
        if(!config.appPath){
            config.appPath = "";
        }
        if(!config.port){
            config.port = 8080;
        }
        if (!config.clrVersion){
            config.clrVersion = "v4.0";
        }
        if (config.configFile != "" && config.appPath != ""){
            throw new util.PluginError(PLUGIN_NAME, "Cannot combine config file-based IIS Express run with path-based run");
        }
        if (config.appPath == "" && config.sitePaths.length == 0){
            throw new util.PluginError(PLUGIN_NAME, "No sites to run in config");
        }
        if(!config.sysTray){
            config.sysTray = true;
        }
        if(!config.iisExpressPath || config.iisExpressPath == ""){
            config.iisExpressPath = process.env.PROGRAMFILES + "\\IIS Express";
        }
        return gulp.src('/index.html')
            .pipe(startSites(config))
            .on('error', util.log);
    }
    
    //launch browser helper function
    gulpIISExpress.launchBrowser = function(config){
        
        // Default options
        if (!config) {
            throw new util.PluginError(PLUGIN_NAME, "Missing config for launchBrowser");
        }
        if (!config.startUrl || config.startUrl == ""){
            throw new util.PluginError(PLUGIN_NAME, "startUrl must be provided");
        }
        if (!config.browser || config.browser == ""){
            config.browser = "chrome";
        }
        return gulp.src('/index.html')
            .pipe(open('', {
                url: config.startUrl,
                app: config.browser
            }))
            .on('error', util.log);
    }

    //starting the sites.
    function startSites(config){

        if (config.sitePaths.length == 0){
            startPathSite(config);
            return;
        }
        
        config.sitePaths.forEach(function(item){
            var cmd = 'iisexpress /site:"'  + item + '"';

            if(config.configFile !== ""){
                cmd += ' /config:"' + config.configFile + '"';
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
    }
    
    //starting an individual site
    function startPathSite(config){
        
        var cmd = 'iisexpress /path:"' + config.appPath + '"';
        cmd += ' /port:' + config.port;
        cmd += ' /clr:' + config.clrVersion;
        
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

        return gulp.src('');
    }

    //Exporting the plugin main function
    module.exports = gulpIISExpress;
})();
