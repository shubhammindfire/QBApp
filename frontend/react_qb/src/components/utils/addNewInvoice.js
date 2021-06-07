import axios from "axios";
import { GET_ITEM_BY_ID, POST_INVOICE } from "./../../Constants.js";

async function getQBOItemId(jwt, itemTableId) {
    try {
        const response = await axios.get(GET_ITEM_BY_ID + `/${itemTableId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        return { success: true, data: response.data.qBOId };
    } catch (error) {
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
    invoiceItems
) {
    let invoiceItemsToPost = [];

    for (let i = 0; i < invoiceItems.length; i++) {
        let qboItemId = null;
        const res = await getQBOItemId(jwt, invoiceItems[i].itemTableId); // this should be the itemId from QBO
        if (res.success === false) {
            continue;
        }
        qboItemId = res.data;
        invoiceItemsToPost.push({
            description: invoiceItems[i].itemDescription,
            amount: invoiceItems[i].itemAmount,
            itemQBOId: await qboItemId, // this should be the itemId from QBO
            name: invoiceItems[i].itemName,
            costPrice: invoiceItems[i].rate,
            quantity: invoiceItems[i].quantity,
        });
    }

    const data = {
        invoiceDate: invoiceDate,
        dueDate: dueDate,
        customerQBOId: qboCustomerId, // this should be the customerId from QBO
        totalAmount: totalAmount,
        balance: balance,
        invoiceItems: invoiceItemsToPost,
    };

    try {
        const response = await axios.post(POST_INVOICE + "/", data, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        if (response.status === 201) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

export default addNewInvoice;
