import React, { useState } from "react";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function InvoiceItemInInvoiceTable(props) {
    const {
        invoiceItem,
        items,
        operation,
        updateItemsCallback,
        deleteItemCallback,
        index,
    } = props;
    const [itemName, setItemName] = useState(invoiceItem.itemName ?? "");
    const [itemDescription, setItemDescription] = useState(
        invoiceItem.itemDescription ?? ""
    );
    const [quantity, setQuantity] = useState(invoiceItem.quantity ?? 0);
    const [rate, setRate] = useState(invoiceItem.rate ?? 0.0);
    const [itemAmount, setItemAmount] = useState(invoiceItem.itemAmount ?? 0.0);
    let itemNameListAsString = [];
    let newinvoiceItem = invoiceItem;

    function handleChange(e, attribute) {
        e.preventDefault();

        if (attribute === "itemName") {
            setItemName(e.target.value);
            newinvoiceItem.itemName = e.target.value;
            if (itemNameListAsString.includes(e.target.value)) {
                for (let j = 0; j < items.length; j++) {
                    if (items[j].name === e.target.value) {
                        newinvoiceItem.itemTableId = items[j].id;
                        setItemDescription(items[j].description);
                        newinvoiceItem.itemDescription = items[j].description;
                        // here I set quantity to 1 whenever new item is selected from dropdown
                        // I don't give quantity from the items[j] because items[j].quantity is the total quantity in hand
                        setQuantity(1);
                        newinvoiceItem.quantity = 1;
                        setRate(items[j].costPrice);
                        newinvoiceItem.rate = items[j].costPrice;
                        // I don't use variable quantity and rate here because they aren't updated by this point
                        setItemAmount(1 * items[j].costPrice);
                        newinvoiceItem.itemAmount = items[j].costPrice;
                        updateItemsCallback("Edit", newinvoiceItem, index);
                        break;
                    }
                }
            }
        } else if (attribute === "quantity") {
            setQuantity(e.target.value);
            newinvoiceItem.quantity = parseInt(e.target.value);
            setItemAmount(e.target.value * rate);
            newinvoiceItem.itemAmount = e.target.value * rate;
            updateItemsCallback("Edit", newinvoiceItem, index);
        }
    }

    function handleDelete(e) {
        e.preventDefault();
        deleteItemCallback(index);
    }

    function getItemNameList() {
        let itemNameList = [];

        if (items !== undefined) {
            for (let i = 0; i < items.length; i++) {
                itemNameList.push(
                    <option value={items[i].name} key={items[i].name} />
                );
                itemNameListAsString.push(items[i].name);
            }
        }
        return itemNameList;
    }

    return (
        <tr className="text-center hover:bg-gray-100">
            <td className="border-r-2 border-t-2">{index + 1}</td>
            <td className="border-r-2 border-t-2">
                <input
                    list="invoiceItemNames"
                    className="inline p-2 border border-black xs:w-full"
                    placeholder="Select an item"
                    value={itemName}
                    disabled={operation === "View" ? true : false}
                    onChange={(e) => handleChange(e, "itemName")}
                />
                <datalist id="invoiceItemNames">{getItemNameList()}</datalist>
            </td>
            <td className="border-r-2 border-t-2">{itemDescription}</td>
            <td className="border-r-2 border-t-2">
                <input
                    type="text"
                    className="block xs:w-full"
                    value={quantity}
                    disabled={operation === "View" ? true : false}
                    onChange={(e) => handleChange(e, "quantity")}
                />
            </td>
            <td className="border-r-2 border-t-2">{rate}</td>
            <td className="border-r-2 border-t-2">{itemAmount}</td>
            <td className="border-t-2">
                <button
                    onClick={(e) => handleDelete(e)}
                    disabled={operation === "View" ? true : false}
                >
                    <FontAwesomeIcon icon={faTrashAlt} color="#696969" />
                </button>
            </td>
        </tr>
    );
}

export default InvoiceItemInInvoiceTable;
