"use client"
import React from "react";
import { createContext, useState, useContext } from "react"
import axios from "axios";
const AppContext = createContext();
export const AppProvider = ({children}) => {
 
  const [currentUser, setcurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 1000,
    // headers: { "x-auth-token": currentUser.token },
  });

const [loggedIn, setloggedIn] = useState(false)

const logout=()=>{

}

return<AppContext.Provider value={{currentUser, setcurrentUser, axiosInstance, loggedIn, setloggedIn, logout}}>
{children}

</AppContext.Provider>

};
 const useAppContext=()=>useContext(AppContext);
 export default useAppContext;