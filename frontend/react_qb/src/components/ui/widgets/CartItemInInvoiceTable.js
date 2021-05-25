import React, { useState } from "react";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { GET_ITEM_BY_ID } from "../../../Constants";
import { useSelector } from "react-redux";

function CartItemInInvoiceTable(props) {
    const jwt = useSelector((state) => state.localAuth.jwt);
    const { cartItem, items, balance, index } = props;
    const [itemName, setItemName] = useState(cartItem.itemName ?? "");
    const [itemDescription, setItemDescription] = useState(
        cartItem.itemDescription ?? ""
    );
    const [quantity, setQuantity] = useState(cartItem.quantity ?? 0);
    const [rate, setRate] = useState(cartItem.rate ?? 0.0);
    const [itemAmount, setItemAmount] = useState(cartItem.itemAmount ?? 0.0);
    let itemNameListAsString = [];

    function handleChange(e, attribute) {
        e.preventDefault();

        if (attribute === "itemName") {
            setItemName(e.target.value);
            if (itemNameListAsString.includes(e.target.value)) {
                for (let j = 0; j < items.length; j++) {
                    if (items[j].name === e.target.value) {
                        setItemDescription(items[j].description);
                        // here I set quantity to 1 whenever new item is selected from dropdown
                        // I don't give quantity from the items[j] because items[j].quantity is the total quantity in hand
                        setQuantity(1);
                        setRate(items[j].costPrice);
                        // I don't use variable quantity and rate here because they aren't updated by this point
                        setItemAmount(1 * items[j].costPrice);
                        j = items.length; //this is to end the loop like break
                    }
                }
            }
        } else if (attribute === "itemDescription") {
            setItemDescription(e.target.value);
        } else if (attribute === "quantity") {
            setQuantity(e.target.value);
        } else if (attribute === "rate") {
            setRate(e.target.value);
        }
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
                    disabled={balance === 0.0 ? true : false}
                    onChange={(e) => handleChange(e, "itemName")}
                />
                <datalist id="cartItemNames">
                    {/* TODO: fetch this list of cart items */}
                    {getItemNameList()}
                </datalist>
            </td>
            <td className="border-r-2 border-t-2">
                <input
                    type="text"
                    className="block xs:w-full"
                    value={itemDescription}
                    disabled={balance === 0.0 ? true : false}
                    onChange={(e) => handleChange(e, "itemDescription")}
                />
            </td>
            <td className="border-r-2 border-t-2">
                <input
                    type="text"
                    className="block xs:w-full"
                    value={quantity}
                    disabled={balance === 0.0 ? true : false}
                    onChange={(e) => handleChange(e, "quantity")}
                />
            </td>
            <td className="border-r-2 border-t-2">
                <input
                    type="text"
                    className="block xs:w-full"
                    value={rate}
                    disabled={balance === 0.0 ? true : false}
                    onChange={(e) => handleChange(e, "rate")}
                />
            </td>
            <td className="border-r-2 border-t-2">{itemAmount}</td>
            <td className="border-t-2">
                <button disabled={balance === 0.0 ? true : false}>
                    <FontAwesomeIcon icon={faTrashAlt} color="#696969" />
                </button>
            </td>
        </tr>
    );
}

export default CartItemInInvoiceTable;
