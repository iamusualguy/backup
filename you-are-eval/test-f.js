rnd = (max) => { return Math.floor(Math.random() * (max)) }

String.prototype.format = String.prototype.f = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(m, n) {
        return args[n] ? args[n] : m;
    });
};

var elements = [
    "true", "false", "null",
    1, 0, -1, 0.3,
    "undefined", "NaN",
    "\{\}", "\[\]"];

var conversions = [
    '"{0}"', ,
    "!! {0}", "! {0}", "+ {0}", "++{0}",
    "String({0})", "Number({0})", "Boolean({0})",
    "new String({0})", "new Array({0})", "new Number({0})", "new Boolean({0})"];

var operators = [
    "{0}", "{1}",
    "({0},{1})",
    "{0} > {1}", "{0} < {1}",
    "{0} + {1}", "{0} - {1}",
    "{0} && {1}", "{0} || {1}",
    "{0} * {1}", "{0} == {1}",
    "{0} === {1}"];

function test() {
    return test1(elements, operators, conversions);
}

function test1(elements, operators, conversions) {
    try {
        var leftElementNumber = rnd(elements.length);
        var rightElementNumber = rnd(elements.length);
        var leftconversionNumber = rnd(conversions.length + 7);
        var rightconversionNumber = rnd(conversions.length + 7);

        var left = conversions[leftconversionNumber]
            ? conversions[leftconversionNumber].f(elements[leftElementNumber])
            : elements[leftElementNumber];
        var right = conversions[rightconversionNumber]
            ? conversions[rightconversionNumber].f(elements[rightElementNumber])
            : elements[rightElementNumber];

        var resStr = operators[rnd(operators.length)].f(left, right);
        console.log(resStr);
        console.log(eval(resStr));
        return resStr;
    }
    catch (e) {
        return test1(elements, operators, conversions);
    }

}

function verifyAnswer(question, answer, domName) {
    if (String(eval(question)) == String(eval(answer))) {
        document.getElementById(domName + '-correct').innerHTML +=
            "<h4><span class='label label-success'>" + question + " = " + eval(question) + "</span></h4>";
    }
    else {
        document.getElementById(domName + '-incorrect').innerHTML +=
            "<h4><span class='label label-danger'>" + question + " = " + eval(question) + "</span></h4>";
    }
}
