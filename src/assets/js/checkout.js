// const deviceId = await Culqi3DS.generateDevice();
// if (!deviceId) {

//   console.log("Ocurrio un error al generar el deviceID");
// }
// else{
//   console.log('DEVICE ID');
//   console.log(deviceId);
// }
import { customerInfo , freeze } from "./config";

const generateChargeImpl = async ({
    email,tokenId,deviceId,parameters3DS = null,}) => {
    console.log(freeze)
    console.log(customerInfo)
    console.log('CUANDO SE USA ESTO');
    const bodyRequest = {
        amount: freeze.TOTAL_AMOUNT,
        currency_code: freeze.CURRENCY,
        email: email,
        source_id: tokenId,
        antifraud_details: {
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
            email: customerInfo.email,
            phone_number: customerInfo.phone,
            device_finger_print_id: deviceId,
        },
    };
    console.log(bodyRequest);
    console.log(parameters3DS);
    return Service.generateCharge(
        parameters3DS
        ? { ...bodyRequest, authentication_3DS: { ...parameters3DS } }
        : bodyRequest
    );
};

window.culqi = async () => {
  if (Culqi.token) {    
    Culqi.close();
    console.log(Culqi.token);
    console.log(Culqi.token.email);
    tokenId = Culqi.token.id;
    email = Culqi.token.email;
    //selectors.loadingElement.style.display = "block";

    let statusCode = null;
    let objResponse = null;
    console.log("pagos");
    const responseCharge = await generateChargeImpl({deviceId,email,tokenId}); //1ra llamada a cargo
    objResponse = responseCharge.data;
    statusCode = responseCharge.statusCode;
    if (statusCode === 200) {
        if(objResponse.action_code === "REVIEW"){
            validationInit3DS({ email, statusCode, tokenId });
        }
    } else if (statusCode === 201) {
        $("#response_card").text("OPERACIÓN EXITOSA - SIN 3DS");
        Culqi3DS.reset();
    } else {
        $("#response_card").text("OPERACIÓN FALLIDA - SIN 3DS");
        Culqi3DS.reset();
    }
  } else {
    console.log(Culqi.error);
    alert(Culqi.error.user_message);
  }
};

const validationInit3DS = ({ statusCode, email, tokenId }) => {
    console.log(statusCode);
    console.log(email);
    console.log(tokenId);

    Culqi3DS.settings = {
        charge: {
            totalAmount: config.TOTAL_AMOUNT,
            returnUrl: config.URL_BASE,
        },
        card: {
            email: email,
        },
    };
    Culqi3DS.initAuthentication(tokenId);
};