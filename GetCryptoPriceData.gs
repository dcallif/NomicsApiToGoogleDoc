function getPrices() {
  var coins = ["XRP", "XTZ", "ETH", "ETH2", "NANO", "BTC", "BCH"];
  var key = "123456";

  // Call Nomics API once per coin in coins array and set data in spreadsheet
  for (var i = 0; i < coins.length; i++) {
    var response = UrlFetchApp.fetch("https://api.nomics.com/v1/currencies/ticker?interval=1d&status=active&sort=rank&ids=" + coins[i] + "&key=" + key);
    var data = JSON.parse(response);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    //Logger.log(data[0]["id"] + " Price: " + data[0]["price"]);

    //Start at row 1, end at the last row of the spreadsheet
    for(var n = 1; n < sheet.getLastRow(); n = n + 5){
      // Get crypto ticker value in column A
      var value = sheet.getRange(n, 1).getValue();
      // Compare cell value to crypto ticker
      if(value == data[0]["id"]){
        var oldPrice = sheet.getRange(n + 1, 1).getValue();
        var newPrice = data[0]["price"];
        //Logger.log("Old Price: $" + oldPrice);
        //Logger.log("New Price: $" + newPrice);

        // Add price value to cell
        sheet.setActiveRange(sheet.getRange(n + 1, 1)).setValue(newPrice);
        // Change cell color to denote difference
        if (newPrice > oldPrice) {
          // Green
          sheet.getRange(n + 1, 1).setBackgroundRGB(0, 255, 0);
          sheet.getRange(n, 2).setBackgroundRGB(0, 255, 0);
        } else {
          // Red
          sheet.getRange(n + 1, 1).setBackgroundRGB(255, 0, 0);
          sheet.getRange(n, 2).setBackgroundRGB(255, 0, 0);
        }
        // Add percentage difference next to crypto ticker cell in Column B which is formatted for percentages
        sheet.setActiveRange(sheet.getRange(n, 2)).setValue((newPrice - oldPrice) / oldPrice);
        break;
      }
    }
    // Need to wait as to not hit API rate limit
    Utilities.sleep(1000);
  }
  Logger.log("Successfully updated prices!");
}
