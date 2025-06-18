import Moment from "moment";

module.exports = {

  changeTimeFormat(time) {
    if (time && "" != time && 8 == time.length) {
      return time.substring(0, 5);
    }
    return time;
  },

  changeDateFormat(date) {
    if (date && "" != date && 10 == date.length) {
      if (Moment(date, "YYYY-MM-DD", true).isValid()) {
        return Moment(date).format("DD-MM-YYYY");
      } else {
        return date;
      }
    }
    return date;
  },
  getDate(date) {
    return Moment(date).format("DD-MM-YYYY");
  },
  getTime(date) {
    return Moment(date).format("HH:mm:ss");
  },
  changeDateTimeFormat(date) {
    if (date && "" != date) {
      return Moment(date).format("HH:mm:ss DD-MM-YYYY");
    }
    return date;
  },

  changeDateTimeFormatTo(date, formatDate) {
    if (date && "" != date) {
      return Moment(date).format(formatDate);
    }
    return date;
  },

  changeTimeFormatTo(time) {
    if (time != "") {
      return Moment(time, "HH:mm:ss").format("HH:mm");
    }
    return time;
  },


  formatValue(value, separator, prefix, suffix) {
    try {
      if (value) {
        let stringValue = value.toString();
        if (stringValue.includes(".")) {
          stringValue = stringValue.split(".")[0];
        }

        let formattedValue = [];
        if (suffix) {
          formattedValue.push(suffix);
        }

        let count = 1;
        for (let i = stringValue.length - 1; i >= 0; i--) {
          formattedValue.push(stringValue[i]);
          if (count === 3 && i > 0) {
            formattedValue.push(separator || " ");
            count = 1;
          } else {
            count++;
          }
        }
        formattedValue.reverse();

        if (prefix) {
          formattedValue.push(prefix);
        }
        formattedValue = formattedValue.join("");

        if (value.toString().includes(".")) {
          formattedValue += "." + value.toString().split(".")[1];
        }

        return formattedValue;
      } else {
        return "0";
      }
    } catch (e) {
      return "0";
    }
  },

  formatNumber(amount, decimalCount = 0, decimal = ",", thousands = ".") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;

      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
          : "")
      );
    } catch (e) {
      console.log(e);
    }
  },

  uuidGenerator() {
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + "-" + S4() + "-" + S4();
    // return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },

  isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  },

  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  calcCrow(latitude1, longitude1, latitude2, longitude2) {
    // Converts numeric degrees to radians
    let toRad = function (Value) {
      return (Value * Math.PI) / 180;
    };
    var R = 6371; // km
    var dLat = toRad(latitude2 - latitude1);
    var dLon = toRad(longitude2 - longitude1);
    var lat1 = toRad(latitude1);
    var lat2 = toRad(latitude2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
  },
  convertTimeFormat(timeStr) {
    // Hàm chuyển đổi từ chuỗi thành đối tượng Date
    function parseTimeStr(timeStr) {
      var timeParts = timeStr.split(/[\s,]+/);
      var dateParts = timeParts[0].split('/');
      var timeParts = timeParts[1].split(':');
      var dateTime = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
      // Thêm múi giờ +07:00
      dateTime.setHours(dateTime.getHours() + 7);
      return dateTime.toISOString().replace(/\.\d{3}Z$/, "+07:00");
    }

    // Chuyển đổi từng chuỗi thời gian
    var convertedTime = parseTimeStr(timeStr);

    return convertedTime;
  }
};
