const freeze ={
    TOTAL_AMOUNT: 0, //variable
    // DEFECTO
    CURRENCY: "PEN",
    //pk_live_fd474cb65b5a677d produccion
    //pk_test_1f79139005666a3d preprod
    PUBLIC_KEY: "pk_test_1f79139005666a3d",
    COUNTRY_CODE: "PE",
    ORDER_NUMBER: "PE",
    // DEFECTO PRODUCCION
    // RSA_ID: "de35e120-e297-4b96-97ef-10a43423ddec",
    // RSA_PUBLIC_KEY: '-----BEGIN PUBLIC KEY-----'+
    // 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDswQycch0x/7GZ0oFojkWCYv+g'+
    // 'r5CyfBKXc3Izq+btIEMCrkDrIsz4Lnl5E3FSD7/htFn1oE84SaDKl5DgbNoev3pM'+
    // 'C7MDDgdCFrHODOp7aXwjG8NaiCbiymyBglXyEN28hLvgHpvZmAn6KFo0lMGuKnz8'+
    // 'HiuTfpBl6HpD6+02SQIDAQAB'+
    // '-----END PUBLIC KEY-----',
    URL_BASE: "http://127.0.0.1:8000/api/",
};

const customerInfo = {
    firstName: '',
    lastName: '',
    address: '',
    address_c: '',
    phone: '',
    email: ''
};

function config_data(data) {
    freeze.TOTAL_AMOUNT=data.TOTAL_AMOUNT
    freeze.ORDER_NUMBER=data.ORDER_NUMBER

    customerInfo.firstName=data.firstName
    customerInfo.lastName=data.lastName
    customerInfo.address=data.address
    customerInfo.address_c=data.address_c
    customerInfo.phone=data.phone
    customerInfo.email=data.email
}

export { config_data };

export { customerInfo };

export { freeze };