
var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
   dest: 'target/screenshots',
   filename: 'my-report.html'
   /* userCss:'my-report.css',
    useJs:'my-report.js',
    reportTitle:'superCalculator',
    showSummary:true
    /* if i need to capture failed specs 
     captureOnlyFailedSpecs:true
     
     display total number of specs and failed 
     showSummary:true
  
     //edit report title
     reportTitle:'reporttitle'
     */
});

// config.js
exports.config = {
   //to connect directly to browserDriver without selenium 
   directConnect: true,

   //by default will be chrome
   capabilities: {
      'browserName': 'chrome'
   },

   //by default will be Jasmine
   framework: 'jasmine',

   //by default will be http://localhost:4444/wd/hub
   seleniumAddress: 'http://localhost:4444/wd/hub',

   // Spec patterns are relative to the current working directory when
   // protractor is called.
   specs: ['spec.js'],

   // timeout from jasmine for each it to not make test run forever or very long - http://www.protractortest.org/#/timeouts#timeouts-from-jasmine
   jasmineNodeOpts: {
      defaultTimeoutInterval: 30000,
      showColors: true
   },




   // Setup the report before any tests start
   beforeLaunch: function () {
      return new Promise(function (resolve) {
         reporter.beforeLaunch(resolve);

         /*
            By default, no report is generated if an exception is thrown from within the test run.
             You can however catch these errors and make jasmine report current spec explicitly.
   
            process.on('uncaughtException', function () {
            reporter.jasmineDone();
            reporter.afterLaunch();
            });
         */
      });


   },

   // Assign the test reporter to each running instance
   onPrepare: function () {

      var jasmineReporters = require('jasmine-reporters');
      jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
         consolidateAll: true,
         savePath: './',
         filePrefix: 'xmlresults'
      }));

      var fs = require('fs-extra');

      fs.emptyDir('screenshots/', function (err) {
         console.log(err);
      });

      jasmine.getEnv().addReporter({
         specDone: function (result) {
            if (result.status == 'failed') {
               browser.getCapabilities().then(function (caps) {
                  var browserName = caps.get('browserName');

                  browser.takeScreenshot().then(function (png) {
                     var stream = fs.createWriteStream('screenshots/' + browserName + '-' + result.fullName + '.png');
                     stream.write(new Buffer(png, 'base64'));
                     stream.end();
                  });
               });
            }
         }
      });

      jasmine.getEnv().addReporter(reporter);

      var AllureReporter = require('jasmine-allure-reporter');
      jasmine.getEnv().addReporter(new AllureReporter({
         resultsDir: 'allure-results'
      }));
   },

   // Close the report after all tests finish
   afterLaunch: function (exitCode) {
      return new Promise(function (resolve) {
         reporter.afterLaunch(resolve.bind(this, exitCode));
      });
   },

   //HTMLReport called once tests are finished
   onComplete: function () {
      var browserName, browserVersion;
      var capsPromise = browser.getCapabilities();

      capsPromise.then(function (caps) {
         browserName = caps.get('browserName');
         browserVersion = caps.get('version');
         platform = caps.get('platform');

         var HTMLReport = require('protractor-html-reporter-2');

         testConfig = {
            reportTitle: 'Protractor Test Execution Report',
            outputPath: './',
            outputFilename: 'ProtractorTestReport',
            screenshotPath: './screenshots',
            testBrowser: browserName,
            browserVersion: browserVersion,
            modifiedSuiteName: false,
            screenshotsOnlyOnFailure: true,
            testPlatform: platform
         };
         new HTMLReport().from('xmlresults.xml', testConfig);
      });
   }


}