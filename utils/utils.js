export const checkNumberField = async (fieldValue, fieldName) => {
    if (isNaN(fieldValue)) {
        throw [400, `${fieldName} must be a number.`];
    }
    return Number(fieldValue);
}

export const checkIfPositive = async (fieldValue, fieldName) => {
    if (fieldValue < 0) {
        throw [400, `${fieldName} must be greater than or equal to 0.`];
    }
    return Number(fieldValue);
}

export const checkCheckBox = async (fieldValue, fieldName) => {
    if (fieldValue != undefined && fieldValue != 'on' ) {
        throw [400, `${fieldName} failed (this is an internal server issue).`];
    }
    return fieldValue == 'on' ? true : false;
}

