import React from 'react';
import Popup from "reactjs-popup";
import { AiOutlineClose } from "react-icons/ai";
import { usePopup } from "@/context/PopupContext.jsx";

function PopupView() {
    const { popupContent, clearPopup } = usePopup();

    if (!popupContent) return null;

    return (
        <Popup
            open={!!popupContent}
            className="!bg-transparent"
            onClose={clearPopup}
            position="center center"
            modal
            nested
        >
            {(close) => (
                <div className="bg-gray-100 text-black rounded-lg shadow-2xl border-[1.5px] md:min-w-[30rem] md:max-w-[32rem] min-w-[19rem] mx-auto p-6">
                    <div className="flex items-center justify-end mb-4">
                        {/*<h3 className="text-lg font-semibold">Notification</h3>*/}
                        <button onClick={close} className="text-gray-700 aspect-square rounded-full hover:text-gray-500">
                            <AiOutlineClose size={24}/>
                        </button>
                    </div>

                    {/* Render your passed-in component here */}
                    <div className="mt-4">
                        {popupContent}
                    </div>
                </div>
            )}
        </Popup>
    );
}

export default PopupView;
