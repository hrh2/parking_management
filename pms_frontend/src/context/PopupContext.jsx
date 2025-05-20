import React, { createContext, useState, useContext } from 'react';

const PopupContext = createContext();

export function PopupProvider({ children }) {
    const [popupContent, setPopupContent] = useState(null);

    const showPopup = (component) => {
        setPopupContent(component);
    };

    const clearPopup = () => {
        setPopupContent(null);
    };

    return (
        <PopupContext.Provider value={{ popupContent, showPopup, clearPopup }}>
            {children}
        </PopupContext.Provider>
    );
}

export function usePopup() {
    return useContext(PopupContext);
}
