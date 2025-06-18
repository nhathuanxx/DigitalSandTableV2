import { useEffect, useState } from "react";

export const removeAccents = (str) => {
  const accentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];

  for (let i = 0; i < accentsMap.length; i++) {
    const re = new RegExp("[" + accentsMap[i].substring(1) + "]", "g");
    const char = accentsMap[i][0];
    str = str.replace(re, char);
  }

  return str;
};
export const onlyUnique = (value, index, array) =>
  array.indexOf(value) === index;

export const getLabelByValue = (value, arr) => {
  const result = arr.find((p) => p.value == value);
  return result ? result.label : null;
};
export const isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const getEnumKeyByLabel = (
  metaFunction,
  label,
  translationFn
) => {
  const entry = Object.entries(metaFunction(translationFn)).find(
    ([_, value]) => value.label === label
  );
  return entry ? Number(entry[0]) : undefined;
};

export const clampStagePosition = (pos, scale, stageRef) => {
  const scaledWidth = 3000 * scale;
  const scaledHeight = 3000 * scale;

  const stage = stageRef.current;
  if (!stage) return;

  const stageWidth = stage.width();
  const stageHeight = stage.height();

  const minX = Math.min(0, stageWidth - scaledWidth);
  const minY = Math.min(0, stageHeight - scaledHeight);

  const x = Math.min(0, Math.max(pos.x, minX));
  const y = Math.min(0, Math.max(pos.y, minY));

  return { x, y };
};
export const normalize = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase();
};

export const toDataURL = (base64Str, mimeType = "image/png") => {
  return `data:${mimeType};base64,${base64Str}`;
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const binaryStringToBase64 = (str) => {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return Buffer.from(bytes).toString('base64');
}
