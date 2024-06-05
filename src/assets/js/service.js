import { customerInfo , freeze } from "./config";

function greet(requestData) {
    //Culqi.publicKey = "pk_live_fd474cb65b5a677d"; //defecto prod
    //Culqi.publicKey = "pk_test_1f79139005666a3d"; //defecto prueba
    Culqi.publicKey = "pk_test_1f79139005666a3d"; //defecto prod
    Culqi.settings({
        currency: requestData.currency_code,
        amount: requestData.amount,
        title: "ALTUX - ifinity ♾️",
        order: requestData.order_number,
        // xculqirsaid: 'd3fd4e3d-7252-4502-998d-2a58be9c9a88',
        // rsapublickey: '-----BEGIN PUBLIC KEY-----'+
        // 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvsTXaudGcCa11FcROsJ0yIPAA'+
        // 'ypAZZyR2f//Py33dXsfVOPmbPu2YcM7t6x5GHKtVF3CLnCSMO+wsLA3KCxPr5oX4'+
        // 'lxua/wiwZOVY+ylw14fk/5heHmqJrZD9m4m5Brx8DnYLX91zX22x+RWp9Gf+bLQb'+
        // 'ifcfNUAmC5TTR6JgQwIDAQAB'+
        // '-----END PUBLIC KEY-----',
    });
    Culqi.options({
        lang: "auto",
        paymentMethods: requestData.paymentMethods,
        installments: true,
        logo: "https://static.culqi.com/v2/v2/static/img/logo.png"
    });
    Culqi.open();
    return true;
    // fetch(apiUrl, requestOptions).then(response => response.json()).then(data => {
    //     // Imprime la respuesta de la API (puedes hacer más con esta respuesta si es necesario)
    //     // console.log("Respuesta de la API:", data);
    //     // console.log("Order Number:", data.id);

    //     // Luego de obtener la respuesta, configura la ventana de pago de Culqi
    //     Culqi.publicKey = "pk_test_1f79139005666a3d";
    //     Culqi.settings({
    //         currency: "PEN",
    //         amount: 600,
    //         title: "ALTUX - ifinity ♾️",
    //         order: data.id,
    //         // xculqirsaid: 'de35e120-e297-4b96-97ef-10a43423ddec',
    //         // rsapublickey: `-----BEGIN PUBLIC KEY-----
    //         // MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDswQycch0x/7GZ0oFojkWCYv+g
    //         // r5CyfBKXc3Izq+btIEMCrkDrIsz4Lnl5E3FSD7/htFn1oE84SaDKl5DgbNoev3pM
    //         // C7MDDgdCFrHODOp7aXwjG8NaiCbiymyBglXyEN28hLvgHpvZmAn6KFo0lMGuKnz8
    //         // HiuTfpBl6HpD6+02SQIDAQAB
    //         // -----END PUBLIC KEY-----`,    
    //     });
    //     Culqi.options({
    //         lang: "auto",
    //         paymentMethods: {
    //             tarjeta: true,
    //             yape: true,
    //             billetera: true,
    //             bancaMovil: true,
    //             agente: true,
    //             cuotealo: false,
    //         },
    //         installments: true,
    //         logo: "https://static.culqi.com/v2/v2/static/img/logo.png"
    //     });
    //     Culqi.open();
    // })
    // .catch(error => {
    //     console.error("Error en la solicitud a la API:", error);
    // });
}

export { greet };