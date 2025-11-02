function prom(param) {
    return new Promise((resolve, reject) => {
        if (param) {
            resolve(param)
        } else {
            reject("Errorss")
        }
    })
}

async function prom1() {
    return await prom("A")
}

try {
    console.log(await prom1())
} catch (error) {
    console.log(error)
}