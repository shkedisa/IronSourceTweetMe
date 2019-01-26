exports.QUERY = "Query";
exports.TEXT = "Text";
exports.USERNAME = "Username";
exports.INVALID_COUNT = "Count must be a positive number";

exports.invalidString = function(str) {
    return str + " must be a non empty string";
};

exports.sendValidationError = function(toResponse, withErrorMessage) {
    sendError(toResponse, 400, withErrorMessage);
};

exports.sendTwitterError = function(res) {
    sendError(res, 500, "Error from Twitter");
};

exports.validateNonEmptyString = function(str) {
    return (str !== undefined && str.length > 0);
};

exports.validateIsPositiveNumber = function(numStr) {
    let num = parseInt(numStr);
    return (num !== undefined && Number.isInteger(num) && num > 0);
};

exports.performWithValidation = function(validationConstrains, success, failure) {
    let allValidationsSucceeded = true;
    validationConstrains.forEach(function (validations) {
            let fieldToValidate = validations[0], validationMethod = validations[1], validationError = validations[2];
            if (!validationMethod(fieldToValidate)) {
                failure(validationError);
                allValidationsSucceeded = false;
                return;
            }
        }
    );
    if (allValidationsSucceeded) {
        success();
    }
}

function sendError(res, withCode, withMessage) {
    res.status(withCode).send(withMessage);
}