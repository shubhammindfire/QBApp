import React, { useEffect, useState } from "react";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

function CartItemInInvoiceTable(props) {
    const {
        cartItem,
        items,
        operation,
        updateItemsCallback,
        deleteItemCallback,
        index,
    } = props;
    const [itemName, setItemName] = useState(cartItem.itemName ?? "");
    const [itemDescription, setItemDescription] = useState(
        cartItem.itemDescription ?? ""
    );
    const [quantity, setQuantity] = useState(cartItem.quantity ?? 0);
    const [rate, setRate] = useState(cartItem.rate ?? 0.0);
    const [itemAmount, setItemAmount] = useState(cartItem.itemAmount ?? 0.0);
    let itemNameListAsString = [];
    let newCartItem = cartItem;

    useEffect(() => {
        console.log("Component mount");
        // let newCartItem = cartItem;
        // newCartItem.itemName = itemName;
        // newCartItem.itemDescription = itemDescription;
        // newCartItem.quantity = quantity;
        // newCartItem.rate = rate;
        // newCartItem.itemAmount = itemAmount;
        // callback("Edit", newCartItem, index);
        return () => {
            // cleanup for didComponentDismount
            console.log("Component dismount");
            // updateItemsCallback("Edit", newCartItem, index);
        };
    }, [itemName, itemDescription, quantity, rate, itemAmount]);

    function handleChange(e, attribute) {
        e.preventDefault();

        if (attribute === "itemName") {
            setItemName(e.target.value);
            newCartItem.itemName = e.target.value;
            if (itemNameListAsString.includes(e.target.value)) {
                for (let j = 0; j < items.length; j++) {
                    if (items[j].name === e.target.value) {
                        newCartItem.itemTableId = items[j].id;
                        setItemDescription(items[j].description);
                        newCartItem.itemDescription = items[j].description;
                        // here I set quantity to 1 whenever new item is selected from dropdown
                        // I don't give quantity from the items[j] because items[j].quantity is the total quantity in hand
                        setQuantity(1);
                        newCartItem.quantity = 1;
                        setRate(items[j].costPrice);
                        newCartItem.rate = items[j].costPrice;
                        // I don't use variable quantity and rate here because they aren't updated by this point
                        setItemAmount(1 * items[j].costPrice);
                        newCartItem.itemAmount = items[j].costPrice;
                        updateItemsCallback("Edit", newCartItem, index);
                        break;
                    }
                }
            }
        } else if (attribute === "quantity") {
            setQuantity(e.target.value);
            newCartItem.quantity = parseInt(e.target.value);
            setItemAmount(e.target.value * rate);
            newCartItem.itemAmount = e.target.value * rate;
            updateItemsCallback("Edit", newCartItem, index);
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
                    list="cartItemNames"
                    className="inline p-2 border border-black xs:w-full"
                    placeholder="Select an item"
                    value={itemName}
                    disabled={operation === "View" ? true : false}
                    onChange={(e) => handleChange(e, "itemName")}
                />
                <datalist id="cartItemNames">{getItemNameList()}</datalist>
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

export default CartItemInInvoiceTable;
