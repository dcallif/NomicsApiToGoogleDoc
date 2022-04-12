function getPrices() {
  var key = "123456";
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Start at row 1, end at the last row of the spreadsheet
  for (var n = 1; n < sheet.getLastRow(); n = n + 5) {
    // Get crypto ticker value in column A
    var value = sheet.getRange(n, 1).getValue();
    // Call API with ticker to retrieve price
    var response = UrlFetchApp.fetch("https://api.nomics.com/v1/currencies/ticker?interval=1d&status=active&sort=rank&ids=" + value + "&key=" + key);
    var data = JSON.parse(response);

    var oldPrice = sheet.getRange(n + 1, 1).getValue();
    var newPrice = data[0]["price"];

    Logger.log("Old Price: $" + oldPrice);
    Logger.log("New Price: $" + newPrice);

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

    // Need to wait as to not hit API rate limit
    Utilities.sleep(500);
  }
}
