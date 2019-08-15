 // Number text box exceed validator
 function myFunction() {
     var inpObj = document.getElementById("id1");
     if (!inpObj.checkValidity()) {
         document.getElementById("demo1").innerHTML = inpObj.validationMessage;
     } else {
         document.getElementById("demo1").innerHTML = '';
     }
 }

 document.addEventListener("DOMContentLoaded", function (event) {
     //1.1 Cash back Incentive
     // Range slider display text
     var slider = document.getElementById("myRange");
     var output = document.getElementById("demo");
     output.innerHTML = '$' + slider.value;
     var upfront = Math.round(((slider.value * 0.006) - 1318), 2)
     document.getElementById("cashBack").innerHTML = 'Your cash back: $' + upfront;

     var trailing = Math.round(((slider.value * 0.03616027) - 3062.6), 2)
     document.getElementById("overLife").innerHTML = 'Over the life: $' + trailing;

     slider.oninput = function () {
         var loanAmount0 = this.value;
         // var upfront = Math.round(((loanAmount0 * 0.006) - 1318), 2)
         var upfront = ((loanAmount0 * 0.006) - 1318)
         upfront = upfront.toFixed(2);
         document.getElementById("cashBack").innerHTML = 'Your cash back: $' + upfront;
         // var trailing = Math.round(((loanAmount0 * 0.03616027) - 3062.6), 2)
         var trailing = ((loanAmount0 * 0.03616027) - 3062.6)
         trailing = trailing.toFixed(2);
         document.getElementById("overLife").innerHTML = 'Over the life: $' + trailing;
         output.innerHTML = '$' + loanAmount0;
     }

 })
