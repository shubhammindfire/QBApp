// this function returns the customerQBO id from the customerName
function getQBOCustomerId(customers, customerName) {
    let customerId = null;
    customers.forEach((customer) => {
        if (customer.displayName === customerName)
            customerId = customer.customerId;
    });
    if (customerId !== null) return customerId;
    else throw Error("Customer Id not found");
}

export default getQBOCustomerId;
