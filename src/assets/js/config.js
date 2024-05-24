const freeze ={
    TOTAL_AMOUNT: 0, //variable
    // DEFECTO
    CURRENCY: "PEN",
    PUBLIC_KEY: "pk_test_1f79139005666a3d",
    COUNTRY_CODE: "PE",
    // DEFECTO PRODUCCION
    // RSA_ID: "de35e120-e297-4b96-97ef-10a43423ddec",
    // RSA_PUBLIC_KEY: '-----BEGIN PUBLIC KEY-----'+
    // 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDswQycch0x/7GZ0oFojkWCYv+g'+
    // 'r5CyfBKXc3Izq+btIEMCrkDrIsz4Lnl5E3FSD7/htFn1oE84SaDKl5DgbNoev3pM'+
    // 'C7MDDgdCFrHODOp7aXwjG8NaiCbiymyBglXyEN28hLvgHpvZmAn6KFo0lMGuKnz8'+
    // 'HiuTfpBl6HpD6+02SQIDAQAB'+
    // '-----END PUBLIC KEY-----',
    URL_BASE: "http://localhost:4200/ventas/panel",
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