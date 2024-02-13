import React from "react";

function TransactionStatus() {
    return (
        <>
            <div className="pendingTrxPopUp" id="pendingTrxPopUp">
            
                <div style={{ width: " 70px", height: "70px", margin: "15px auto 15px" }}>
                    <svg
                        style={{ width: " 70px", height: " 70px" }}
                        id="check"
                        version="1.1"
                        // xmlns="http://www.w3.org/2000/svg"
                        // xmlns: xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 100 100"
                    // xml: space="preserve"
                    >
                        <circle id="circle" cx="50" cy="50" r="46" fill="transparent" />
                        <polyline id="tick" points="25,55 45,70 75,33" fill="transparent" />
                    </svg>
                </div>
                <h3 id="txStatusHeading">Transaction in Progress</h3>

            </div>
        </>
    );
}

export default TransactionStatus;
