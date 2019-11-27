describe('Protractor Demo', function() {
      //if the website using Synchronization will ignore it and run it as Asynchronization
       //browser.ignoreSynchronization = true;
       let fNum = element(by.model('first'));
       let sNum = element(by.model('second'));
       let goButton = element(by.id('gobutton'));
       let expResult = element(by.binding('latest'));
       let history = element.all(by.repeater('result in memory'));
       let indexOfCalc = element.all(by.repeater('result in memory'));

       beforeEach(function(){
          browser.get('http://juliemr.github.io/protractor-demo/');
       });

       function add (a , b ){
         fNum.sendKeys(a);
         sNum.sendKeys(b);
         goButton.click();
       }

       it('check #no of history', function(){
         add(2,3);
         add(5,2);
         add(7,73);
         add(9,5);

         expect(history.count()).toEqual(4);

         expect(indexOfCalc.get(1).getText()).toContain('80');
       });

       it('Check toContain method',function(){
         add(2,9);

         expect(indexOfCalc.last().getText()).toContain('2 + 9');
       });

       it('Check the page title', function() {
         expect(browser.getTitle()).toEqual('Super Calculator');
      });

      it('should add one and two', function() {
         fNum.sendKeys(1);
         sNum.sendKeys(2);
     
         goButton.click();
     
         expect(expResult.getText()).toEqual('3');
       });

       it('should add four and six', function() {
         fNum.sendKeys(4);
         sNum.sendKeys(6);
     
         goButton.click();
         expect(expResult.getText()).toEqual('10');
       });

       it('should read the value from an input', function() {
         fNum.sendKeys(1);
         expect(fNum.getAttribute('value')).toEqual('1');
       });


 });
