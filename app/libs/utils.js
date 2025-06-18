module.exports = {
  decodePolyline(encoded) {
    var points = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;

    while (index < len) {
      var b, shift = 0, result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push([lng * 1e-5, lat * 1e-5]);
    }

    return points;
  },
  getMapImagesInScreen(z, topLeft, topRight, bottomLeft, bottomRight) {
    // Lấy ra x,y 4 điểm ở 4 góc màn hình
    const xTopLeft = Math.floor((topLeft[0] + 180) / 360 * Math.pow(2, z));
    const yTopLeft = Math.floor((1 - Math.log(Math.tan(topLeft[1] * Math.PI / 180) + 1 / Math.cos(topLeft[1] * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
    const xTopRight = Math.floor((topRight[0] + 180) / 360 * Math.pow(2, z));
    const yTopRight = Math.floor((1 - Math.log(Math.tan(topRight[1] * Math.PI / 180) + 1 / Math.cos(topRight[1] * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
    const xBottomLeft = Math.floor((bottomLeft[0] + 180) / 360 * Math.pow(2, z));
    const yBottomLeft = Math.floor((1 - Math.log(Math.tan(bottomLeft[1] * Math.PI / 180) + 1 / Math.cos(bottomLeft[1] * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
    const xBottomRight = Math.floor((bottomRight[0] + 180) / 360 * Math.pow(2, z));
    const yBottomRight = Math.floor((1 - Math.log(Math.tan(bottomRight[1] * Math.PI / 180) + 1 / Math.cos(bottomRight[1] * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));

    minX = Math.min(xTopLeft, xTopRight, xBottomLeft, xBottomRight)
    maxX = Math.max(xTopLeft, xTopRight, xBottomLeft, xBottomRight)
    minY = Math.min(yTopLeft, yTopRight, yBottomLeft, yBottomRight)
    maxY = Math.max(yTopLeft, yTopRight, yBottomLeft, yBottomRight)

    const points = [];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        points.push({ x, y });
      }
    }
    return { points, xTopLeft, yTopLeft, xTopRight, yTopRight, xBottomLeft, yBottomLeft, xBottomRight, yBottomRight };
  },
  getTimeFromValue(value, dayText, hoursText, minuteText) {
    const totalMinutes = Math.floor(value / 60); // Chuyển ms thành phút
    const totalHours = Math.floor(totalMinutes / 60); // Chuyển phút thành giờ
    const minutes = totalMinutes % 60; // Phần còn lại là phút

    if (totalHours === 0) {
      return `${minutes} ${minuteText}`;
    }
    return `${totalHours} ${hoursText} ${minutes} ${minuteText}`; // Hiển thị đầy đủ cả giờ và phút
  },
  haversineDistance(coord1, coord2) {
    const toRad = (value) => (value * Math.PI) / 180;

    const lat1 = coord1[1];
    const lon1 = coord1[0];
    const lat2 = coord2[1];
    const lon2 = coord2[0];

    const R = 6371; // bán kính trái đất tính bằng km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // khoảng cách tính bằng km
  },
  getBoundsFromCoordinates(coordinates) {
    let minLng = coordinates[0][0];
    let maxLng = coordinates[0][0];
    let minLat = coordinates[0][1];
    let maxLat = coordinates[0][1];

    coordinates.forEach(coord => {
      if (coord[0] < minLng) minLng = coord[0];
      if (coord[0] > maxLng) maxLng = coord[0];
      if (coord[1] < minLat) minLat = coord[1];
      if (coord[1] > maxLat) maxLat = coord[1];
    });

    return [[minLng, minLat], [maxLng, maxLat]];
  },
  getPercent(a, b) {
    if (b === 0) {
      return 0; // Tránh chia cho 0
    }
    const percentage = Math.floor((a / b) * 100);
    return percentage;
  },
  getTime(distance, speed) {
    if (speed === 0) {
      return "Vận tốc không được bằng 0"; // Tránh chia cho 0
    }
    const time = distance / speed;
    return time; // Thời gian trả về theo đơn vị tương ứng
  },
  addHoursToCurrentTime(hoursToAdd) {
    const now = new Date(); // Lấy thời gian hiện tại

    // Tách phần giờ và phút từ số giờ truyền vào
    const hours = Math.floor(hoursToAdd);
    const minutes = Math.floor((hoursToAdd - hours) * 60);

    // Cộng số giờ và phút vào thời gian hiện tại
    now.setHours(now.getHours() + hours);
    now.setMinutes(now.getMinutes() + minutes);

    // Định dạng lại giờ phút theo dạng HH:mm
    const formattedHours = now.getHours().toString().padStart(2, '0');
    const formattedMinutes = now.getMinutes().toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  },
  formatDistance(distance) {
    if (distance >= 1000) {
      // Nếu khoảng cách lớn hơn hoặc bằng 1000, trả về đơn vị km với 1 số lẻ
      return (distance / 1000).toFixed(1) + ' km';
    } else if (distance >= 100) {
      // Nếu khoảng cách lớn hơn hoặc bằng 100, làm tròn đến bội số của 50 mét
      const roundedDistance = Math.round(distance / 50) * 50;
      // Nếu làm tròn thành 1000, chuyển sang km
      if (roundedDistance === 1000) {
        return '1.0 km';
      }
      return roundedDistance + ' m';
    } else {
      // Nếu khoảng cách nhỏ hơn 100, làm tròn đến bội số của 10 mét
      return Math.round(distance / 10) * 10 + ' m';
    }
  },
  getDefaultVoiceLanguage(lang) {
    if (lang == 'vi') {
      return 'vi-VN';
    } else if (lang == 'en') {
      return 'en-US';
    } else if (lang == 'my') {
      return 'my-MM';
    }
  },
};
