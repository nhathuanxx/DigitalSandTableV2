import axios from "axios";

const fetchCamera = async (provinceId, abortController) => {
  return new Promise(async (resolve, reject) => {
    let timeout = false;
    const timeoutId = setTimeout(() => {
      timeout = true;
      abortController.abort();
    }, 20000);

    try {
      const response = await axios.get('https://vehicle.goong.io/api/camera-list', {
        params: {
          provinceId: provinceId
        },
        signal: abortController.signal
      });
      clearTimeout(timeoutId);
      // console.log('response: --- ', JSON.stringify(response.data.data[0]));
      resolve(response.data);
    } catch (error) {
      if (timeout) {
        console.log('error fetch camera ========= timeout');
        reject(new Error('timeout'));
      } else {
        console.log('error fetch camera =========: ', error);
        reject(error);
      }
    }

  })
}

const fetchProvinces = async (abortController) => {
  return new Promise(async (resolve, reject) => {
    let timeout = false;
    const timeoutId = setTimeout(() => {
      timeout = true;
      abortController.abort();
    }, 20000);

    try {
      const response = await axios.get('https://vehicle.goong.io/api/provinces', {
        signal: abortController.signal
      });
      clearTimeout(timeoutId);
      // console.log('response: --- ', JSON.stringify(response.data));
      resolve(response.data);
    } catch (error) {
      if (timeout) {
        console.log('error fetch provinces ========= timeout');
        reject(new Error('timeout'));
      } else {
        console.log('error fetch provinces ========= :', error);
        reject(error);
      }
    }

  })
}

export { fetchCamera, fetchProvinces };