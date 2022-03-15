

function noop(data) {
    console.log(data)
}

export default {
    saveBasketItems: noop,
    auth: {
        onAuthStateChanged: noop,
    }
};
