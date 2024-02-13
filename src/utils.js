import $ from 'jquery'

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