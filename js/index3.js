    document.addEventListener("DOMContentLoaded", function (event) {
        //Range slider display text
        var slider = document.getElementById("myRange");
        var output = document.getElementById("demo");
        output.innerHTML = '$' + slider.value;


        slider.oninput = function () {
            var loanAmount0 = this.value;
            output.innerHTML = '$' + loanAmount0;
        }

    })
