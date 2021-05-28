import axios from "axios";
import { GET_ITEM_BY_ID, POST_INVOICE } from "./../../Constants.js";

async function getQBOItemId(jwt, itemTableId) {
    try {
        const response = await axios.get(GET_ITEM_BY_ID + `/${itemTableId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log(`response ${response.data}`);
        console.log(`item ${response.data.itemId}`);
        return { success: true, data: response.data.itemId };
    } catch (error) {
        console.log("ERROR LOG");
        return { success: false, data: error };
    }
}

async function addNewInvoice(
    jwt,
    invoiceDate,
    dueDate,
    qboCustomerId,
    totalAmount,
    balance,
    cartItems
) {
    let cartItemsToPost = [];

    for (let i = 0; i < cartItems.length; i++) {
        let qboItemId = null;
        const res = await getQBOItemId(jwt, cartItems[i].itemTableId); // this should be the itemId from QBO
        if (res.success === false) {
            continue;
        }
        qboItemId = res.data;
        console.log(qboItemId);
        cartItemsToPost.push({
            description: cartItems[i].itemDescription,
            amount: cartItems[i].itemAmount,
            // itemId: await getQBOItemId(jwt, cartItems[i].itemTableId), // this should be the itemId from QBO
            itemId: await qboItemId, // this should be the itemId from QBO
            name: cartItems[i].itemName,
            costPrice: cartItems[i].rate,
            quantity: cartItems[i].quantity,
        });
    }

    // console.log(JSON.stringify(cartItems[0]));
    console.log(JSON.stringify(cartItemsToPost));

    const data = {
        invoiceDate: invoiceDate,
        dueDate: dueDate,
        customerId: qboCustomerId, // this should be the customerId from QBO
        totalAmount: totalAmount,
        balance: balance,
        cartItems: cartItemsToPost,
    };

    try {
        const response = await axios.post(POST_INVOICE + "/", data, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        console.log("REPSONSE = " + JSON.stringify(response));
        if (response.status === 201) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

export default addNewInvoice;
