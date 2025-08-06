/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});

    const url = import.meta.env.VITE_BACKEND_URL

    const [token, setToken] = useState("")

    const [discount, setDiscount] = useState(0);

    const [food_list, setFoodList] = useState([]);

    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const newCount = prev[itemId] ? prev[itemId] + 1 : 1;
            return {...prev, [itemId]: newCount};
        });

        if (token) {
            await axios.post(url+"/api/cart/add", {itemId}, {headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            if (!prev || typeof prev !== 'object') {
                return {};
            }
            return {...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1)};
        });

        if (token) {
            await axios.post(url+"/api/cart/remove", {itemId}, {headers:{token}})
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get", {}, {headers:{token}})
        const cartData = response.data.cartData;
        // Ensure cartItems is always an object, even if API returns null/undefined
        setCartItems(cartData && typeof cartData === 'object' ? cartData : {})
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        if (!cartItems || typeof cartItems !== 'object') return totalAmount;
        
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list")
        setFoodList(response.data.data);
    }

    useEffect(()=>{
        async function loadData(){
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        discount,
        setDiscount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
