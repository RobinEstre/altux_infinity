// import {Service} from "./service.js";

// const service = new Service();

function greet(apiUrl, requestOptions) {
    fetch(apiUrl, requestOptions).then(response => response.json()).then(data => {
        // Imprime la respuesta de la API (puedes hacer más con esta respuesta si es necesario)
        console.log("Respuesta de la API:", data);
        console.log("Order Number:", data.id);

        // Luego de obtener la respuesta, configura la ventana de pago de Culqi
        Culqi.publicKey = "pk_test_1f79139005666a3d";
        Culqi.settings({
            currency: "PEN",
            amount: 600,
            title: "ALTUX - ifinity ♾️",
            order: data.id,
            // xculqirsaid: 'de35e120-e297-4b96-97ef-10a43423ddec',
            // rsapublickey: `-----BEGIN PUBLIC KEY-----
            // MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDswQycch0x/7GZ0oFojkWCYv+g
            // r5CyfBKXc3Izq+btIEMCrkDrIsz4Lnl5E3FSD7/htFn1oE84SaDKl5DgbNoev3pM
            // C7MDDgdCFrHODOp7aXwjG8NaiCbiymyBglXyEN28hLvgHpvZmAn6KFo0lMGuKnz8
            // HiuTfpBl6HpD6+02SQIDAQAB
            // -----END PUBLIC KEY-----`,    
        });
        Culqi.options({
            lang: "auto",
            paymentMethods: {
                tarjeta: true,
                yape: true,
                billetera: true,
                bancaMovil: true,
                agente: true,
                cuotealo: false,
            },
            installments: true,
            logo: "https://static.culqi.com/v2/v2/static/img/logo.png"
        });
        Culqi.open();
    })
    .catch(error => {
        console.error("Error en la solicitud a la API:", error);
    });
}

export { greet };