// this function returns the customerQBO id from the customerName
function getQBOCustomerId(customers, customerName) {
    let qboCustomerId = null;
    customers.forEach((customer) => {
        if (customer.displayName === customerName)
            qboCustomerId = customer.qBOId;
    });
    if (qboCustomerId !== null) return qboCustomerId;
    else throw Error("Customer Id not found");
}

export default getQBOCustomerId;
