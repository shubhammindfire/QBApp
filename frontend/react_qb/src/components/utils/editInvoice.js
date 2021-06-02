import axios from "axios";
import { GET_ITEM_BY_ID, PATCH_INVOICE } from "../../Constants.js";

async function getQBOItemId(jwt, itemTableId) {
    try {
        const response = await axios.get(GET_ITEM_BY_ID + `/${itemTableId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("getQBOItemId RESPONSE: " + JSON.stringify(response.data));
        return { success: true, data: response.data.qBOId };
    } catch (error) {
        console.log("ERROR LOG");
        return { success: false, data: error };
    }
}

async function editInvoice(
    jwt,
    invoiceId,
    invoiceDate,
    dueDate,
    qboCustomerId,
    totalAmount,
    balance,
    invoiceItems
) {
    console.log(`invoiceId in editInvoiec() ${invoiceId}`);
    console.log(
        `invoiceItems in editInvoiec() ${JSON.stringify(invoiceItems)}`
    );
    let invoiceItemsToPost = [];

    for (let i = 0; i < invoiceItems.length; i++) {
        let qboItemId = null;
        const itemTableId =
            invoiceItems[i].fKItems === undefined
                ? invoiceItems[i].itemTableId
                : invoiceItems[i].fKItems;

        console.log(`itemTableId in editInvoiec() ${itemTableId}`);
        const res = await getQBOItemId(jwt, itemTableId); // this should be the itemId from QBO
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

    // console.log(JSON.stringify(invoiceItems[0]));
    console.log(JSON.stringify(invoiceItemsToPost));

    const data = {
        invoiceDate: invoiceDate,
        dueDate: dueDate,
        customerQBOId: qboCustomerId, // this should be the customerId from QBO
        totalAmount: totalAmount,
        balance: balance,
        invoiceItems: invoiceItemsToPost,
    };

    try {
        const response = await axios.patch(
            PATCH_INVOICE + `/${invoiceId}`,
            data,
            {
                headers: { Authorization: `Bearer ${jwt}` },
            }
        );

        console.log("REPSONSE = " + JSON.stringify(response));
        if (response.status === 200) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

export default editInvoice;
