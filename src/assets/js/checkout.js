import { customerInfo , freeze } from "./config";
import "./culqi3ds.js";
import Swal from "sweetalert2";
import Service from "./generates";

const service = new Service();

let tokenId, email

const generateChargeImpl = async ({
    email,tokenId,deviceId,parameters3DS = null,}) => {
    //console.log('CUANDO SE USA ESTO');
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
        metadata:{
            order_number:freeze.ORDER_NUMBER
        }
    };
    //console.log(bodyRequest);
    //console.log(parameters3DS);
    return service.generateCharge(
        parameters3DS
        ? { ...bodyRequest, authentication_3DS: { ...parameters3DS } }
        : bodyRequest
    );
};
const validationInit3DS = ({ statusCode, email, tokenId }) => {
    console.log(statusCode);
    console.log(email);
    console.log(tokenId);

    Culqi3DS.settings = {
        charge: {
            totalAmount: freeze.TOTAL_AMOUNT,
            returnUrl: "http://localhost:4200/ventas/panel",
        },
        card: {
            email: email,
        },
    };
    Culqi3DS.initAuthentication(tokenId);
};

// const deviceId = await Culqi3DS.generateDevice();
// if (!deviceId) {
//   console.log("Ocurrio un error al generar el deviceID");
// }
// else{
//   console.log('DEVICE ID');
//   console.log(deviceId);
// }

function ejecutar (code) {
    window.culqi = async () => {
        const deviceId = await Culqi3DS.generateDevice();
        if (!deviceId) {
            console.log("Ocurrio un error al generar el deviceID");
        }
        else{
            //console.log('DEVICE ID: '+deviceId);
        }
        if (Culqi.token) {
            Culqi.close();
            tokenId = Culqi.token.id;
            email = Culqi.token.email;

            let statusCode = null;
            let objResponse = null;
            const responseCharge = await generateChargeImpl({deviceId,email,tokenId}); //1ra llamada a cargo
            objResponse = responseCharge.data;
            statusCode = responseCharge.statusCode;
            if (statusCode === 200) {
                console.log("REVIEW")
                Culqi3DS.reset();
                // Swal.fire({
                //   position: "center",
                //   icon: "warning",
                //   title: '¡Error!',
                //   text: '¡Pago No Procesado!',
                //   showConfirmButton: false,
                //   timer:5000
                // });
                // return "REVIEW";
                // if(objResponse.result.action_code === "REVIEW"){
                //     validationInit3DS({ email, statusCode, tokenId });
                // }
            } else if (statusCode === 201) {
                console.log("OPERACIÓN EXITOSA - SIN 3DS");
                //$("#response_card").text("OPERACIÓN EXITOSA - SIN 3DS");
                Culqi3DS.reset();
                if(code!=null){
                    try {
                        const jsonbody={
                            "url_matricula" : code,
                            "estado" : "consumed"
                        }
                        let headers = {}
                        const response = await $.ajax({
                            type: 'PATCH',
                            url: freeze.URL_BASE+`ventas/actualizar/estado/formulario-llenado/`,
                            headers: { "Content-Type": "application/json", ...headers },
                            data: JSON.stringify(jsonbody),
                            success: function (data, status, xhr) {
                                statusCode = xhr.status;
                                //console.log(status)
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: '¡Genial ☺!',
                                    text: '¡Pago Realizado!',
                                    showConfirmButton: false,
                                    timer:7000
                                });
                                setTimeout(window.location.replace("https://app.altux.edu.pe/auth/login"), 7000)                                
                                //response = data;
                            }
                        });
                        const responseJSON = await response;
                        return { statusCode: statusCode, data: responseJSON }
                    } catch (err) {
                        return { statusCode: statusCode, data: null }
                    }
                }else{
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: '¡Genial ☺!',
                        text: '¡Pago Realizado Exitosamente!',
                        showConfirmButton: false,
                        timer:5000
                    });
                    setTimeout(window.location.reload(), 5000)   
                    //window.location.reload()
                }
                // Swal.fire({
                //   position: "center",
                //   icon: "success",
                //   title: '¡Genial ☺!',
                //   text: '¡Pago Realizado!',
                //   showConfirmButton: false,
                //   timer:5000
                // });
                //return "Exitoso";
            } else {
                console.log("OPERACIÓN FALLIDA - SIN 3DS");
                //$("#response_card").text("OPERACIÓN FALLIDA - SIN 3DS");
                Culqi3DS.reset();
                //window.location.reload()
                // Swal.fire({
                //   position: "center",
                //   icon: "warning",
                //   title: '¡Error!',
                //   text: '¡Pago No Procesado!',
                //   showConfirmButton: false,
                //   timer:5000
                // });
                //return "Fallido";
            }
        } 
        //else {
        //     console.log(Culqi.error);
        //     alert(Culqi.error.user_message);
        // }
    };
};

export { ejecutar };