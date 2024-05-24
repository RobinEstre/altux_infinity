import {freeze} from "./config"

Culqi3DS.options = {
    showModal: true,
    showLoading: true,
    showIcon: true,
    closeModalAction: () => window.location.reload(true),
    // style: {
    //     btnColor: "red",
    //     btnTextColor: "yellow",
    // },
};

Culqi3DS.publicKey = freeze.PUBLIC_KEY;