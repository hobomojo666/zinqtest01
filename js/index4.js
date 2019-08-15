function init() {
    var currentLocation = window.location;

    var url = new URL(currentLocation);
    var dob = url.searchParams.get("date");
    var gender = url.searchParams.get("gender");
    var smoke = url.searchParams.get("smoke");
    var income = url.searchParams.get("income");
    var loanAmt = url.searchParams.get("loanAmount");
    var firstName = url.searchParams.get("firstName");
    var lastName = url.searchParams.get("lastName");
    var contactNumber = url.searchParams.get("contact");
    var email = url.searchParams.get("email");
    var state = url.searchParams.get("state");
    var grossIncome = url.searchParams.get("grossIncome");
    var spouse = url.searchParams.get("spouse");
    var dependants = url.searchParams.get("dependants");
    var ageOfDep = url.searchParams.get("ageOfDep");
    var assets = url.searchParams.get("assets");
    var liabilities = url.searchParams.get("liabilities");

    var today = new Date();
    var birthDate = new Date(dob.split('-').reverse().join('-'));

    var currentAge = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    var rate = ((1.05 / 1.03) - 1);
    var discountFactor = (1 / (1 + rate));
    var futureIncomeScaling = (0.5 * grossIncome);
    var childrenExpenseScaling = (0.1 * grossIncome);
    var traumaChildrenExpenseScaling = (0.05 * grossIncome);
    var lifeCoverExpenses = 20000;
    var lifeCoverDebts = Math.max((liabilities - assets), 0);
    var lifeFutureIncomeSpouse;

    if (currentAge > 64 || spouse == "No") {
        lifeFutureIncomeSpouse = 0;
    } else {
        lifeFutureIncomeSpouse = futureIncomeScaling * ((1 - Math.pow(discountFactor, 65 - currentAge)) / (1 - discountFactor)); // need to check
    }

    var depnAggYears = ((0.5 * dependants) * (Math.max((25 - ageOfDep), 0))); // need to check
    var lifeFutureIncomeChildren = (childrenExpenseScaling * depnAggYears);

    var TPD_Expenses = 80000;
    var TPD_CoverDebts = lifeCoverDebts;

    var TPD_FutureIncome = 0;

    if (smoke == "Yes") {
        TPD_FutureIncome = lifeFutureIncomeSpouse;
    } else {
        TPD_FutureIncome = (0.9 * lifeFutureIncomeSpouse);
    }

    var TPD_FutureIncomeChildren;

    if (smoke == "Yes") {
        TPD_FutureIncomeChildren = lifeFutureIncomeChildren;
    } else {
        TPD_FutureIncomeChildren = (0.9 * lifeFutureIncomeChildren);
    }

    var traumaCoverExpenses = 80000;
    var traumaFutureIncomeChildren = (dependants * traumaChildrenExpenseScaling);
    var tempIncomeSupportSpouse;

    if (currentAge > 64) {
        tempIncomeSupportSpouse = 0;
    } else {
        tempIncomeSupportSpouse = (0.5 * futureIncomeScaling);
    }

    // Aggregate 1

    var aggregate1 = (lifeCoverExpenses + lifeCoverDebts + lifeFutureIncomeSpouse + lifeFutureIncomeChildren);
    var lifeCover = Math.round(Math.max(aggregate1, 30000), 2); // math.round in the requirement doc


    // Aggregate 2

    var aggregate2 = (TPD_Expenses + TPD_CoverDebts + TPD_FutureIncome + TPD_FutureIncomeChildren);

    var TPD_Cover = 0;

    if (grossIncome > 1000000) {
        TPD_Cover = 0;
    } else if (aggregate2 >= 5000000) {
        TPD_Cover = 5000000;
    } else {
        TPD_Cover = Math.round(Math.max(aggregate2, 50000), 2);
    }



    // Aggregate 3

    var aggregate3 = (traumaCoverExpenses + tempIncomeSupportSpouse + traumaFutureIncomeChildren);

    var traumaCover = 0;

    if (aggregate3 >= 2000000) {
        traumaCover = 2000000;
    } else {
        traumaCover = Math.round(Math.max(aggregate3, 100000), 2);
    }



    //Aggregate 4

    var aggregate4 = ((0.75 * grossIncome) / 12);

    var IP_Cover = 0;
    
    if (currentAge > 64) {
        IP_Cover = 0;
    } else if (aggregate4 >= 60000) {
        IP_Cover = 60000;
    } else {
        IP_Cover = Math.round(Math.max(aggregate4, 500), 2);
    }

//    document.getElementById("Age").innerHTML = "Age: " + currentAge;
//    document.getElementById("Rate").innerHTML = "Rate: " + rate;
//    document.getElementById("DiscountFactor").innerHTML = "discountFactor: " + discountFactor;
//    document.getElementById("FutureIncomeScaling").innerHTML = "futureIncomeScaling: " + futureIncomeScaling;
//    document.getElementById("ChildrenExpenseScaling").innerHTML = "childrenExpenseScaling: " + childrenExpenseScaling;
//    document.getElementById("TraumaChildrenExpenseScaling").innerHTML = "traumaChildrenExpenseScaling: " + traumaChildrenExpenseScaling;
//    document.getElementById("LifeCoverExpenses").innerHTML = "LifeCoverExpenses: " + lifeCoverExpenses;
//    document.getElementById("LifeCoverDebts").innerHTML = "LifeCoverDebts: " + lifeCoverDebts;
//    document.getElementById("LifeFutureIncomeSpouse").innerHTML = "LifeFutureIncomeSpouse " + lifeFutureIncomeSpouse;
//    document.getElementById("DepnAggYears").innerHTML = "DepnAggYears: " + depnAggYears;
//    document.getElementById("LifeFutureIncomeChildren").innerHTML = "LifeFutureIncomeChildren: " + lifeFutureIncomeChildren;
//    document.getElementById("TPD_Expenses").innerHTML = "TPD_Expenses: " + TPD_Expenses;
//    document.getElementById("TPD_CoverDebts").innerHTML = "TPD_CoverDebts: " + TPD_CoverDebts;
//    document.getElementById("TPD_FutureIncome").innerHTML = "TPD_FutureIncome: " + TPD_FutureIncome;
//    document.getElementById("TPD_FutureIncomeChildren").innerHTML = "TPD_FutureIncomeChildren: " + TPD_FutureIncomeChildren;
//    document.getElementById("TraumaCoverExpenses").innerHTML = "TraumaCoverExpenses: " + traumaCoverExpenses;
//    document.getElementById("TraumaFutureIncomeChildren").innerHTML = "TraumaFutureIncomeChildren: " + traumaFutureIncomeChildren;
//    document.getElementById("TempIncomeSupportSpouse").innerHTML = "TempIncomeSupportSpouse: " + tempIncomeSupportSpouse;
//    document.getElementById("Aggregate1").innerHTML = "Aggregate1: " + aggregate1;
//    document.getElementById("Aggregate2").innerHTML = "Aggregate2: " + aggregate2;
//    document.getElementById("Aggregate3").innerHTML = "Aggregate3: " + aggregate3;
//    document.getElementById("Aggregate4").innerHTML = "Aggregate4: " + aggregate4;
    document.getElementById("lifeCover").innerHTML = "Life Cover: " + lifeCover;
    document.getElementById("TPD_Cover").innerHTML = "TPD_Cover: " +TPD_Cover;
    document.getElementById("traumaCover").innerHTML = "traumaCover: " +traumaCover;
    document.getElementById("IP_Cover").innerHTML = "IP_Cover: " +IP_Cover;

}
