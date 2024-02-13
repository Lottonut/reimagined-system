import $ from 'jquery'

export const truncateAddress = (address) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const toHex = (num) => {
   const val = Number(num);
   return "0x" + val.toString(16);
};

export const userAddress = (address) => {
   return address
}

export const providerURL = () => {
  const SCAN_LINK = {
    testnet: 'https://bsc-dataseed.binance.org',
    mainnet: 'https://bsc-dataseed.binance.org'
  }
  return SCAN_LINK.mainnet
}

export function txStart() {
   $("#check").removeClass('ready')
   $("#check").addClass('progressLoading')
   $("#pendingTrxPopUp").show()
}
export function txDone() {
   $("#txStatusHeading").html("Transaction Completed")
   $("#check").removeClass('progressLoading')
   $("#check").addClass('ready')
}
export function txAfterDone() {
   $("#txStatusHeading").html("Transaction in Progress")
   $("#check").addClass('progressLoading')
   $("#check").removeClass('ready')
   $("#pendingTrxPopUp").hide()
}