import CryptoJS from "crypto-js";

// 这里假设你从环境变量中读取 Laravel 的 APP_KEY (去掉 'base64:' 前缀)
const APP_KEY = import.meta.env.VITE_APP_KEY.replace("base64:", "");

/**
 * 解密 Laravel 传回的 payload
 */
export function decryptPayload(payload: string): any {
  try {
    // 1. Base64 解码外层
    const jsonStr = CryptoJS.enc.Base64.parse(payload).toString(
      CryptoJS.enc.Utf8,
    );
    // 2. 解析 JSON 字符串, { iv, value, mac }
    const { iv, value } = JSON.parse(jsonStr);

    // 2. 解码 Key 和 IV
    const key = CryptoJS.enc.Base64.parse(APP_KEY);
    const ivParsed = CryptoJS.enc.Base64.parse(iv);

    // 3. AES 解密
    const decrypted = CryptoJS.AES.decrypt(value, key, {
      iv: ivParsed,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  } catch (e) {
    console.error("解密失败:", e);
    return null;
  }
}

/**
 * 加密数据发送给 Laravel
 * 注意：Laravel 期待的 payload 实际上只需要解密 value 部分，
 * 但为了配合 Middleware 中的 Crypt::decryptString，
 * 前端必须模拟出 Laravel 的整个加密 JSON 结构（iv, value, mac）。
 */
export function encryptPayload(data: any): string {
  const key = CryptoJS.enc.Base64.parse(APP_KEY);
  const iv = CryptoJS.lib.WordArray.random(16); // 生成随机 IV
  const dataStr = JSON.stringify(data);

  // 1. AES 加密
  const encrypted = CryptoJS.AES.encrypt(dataStr, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const value = encrypted.toString(); // 密文 Base64
  const ivBase64 = CryptoJS.enc.Base64.stringify(iv);

  // 2. 生成 MAC (Laravel 验证需要)
  // Laravel 的 MAC 计算方式：HMAC-SHA256(iv + value)
  const mac = CryptoJS.HmacSHA256(ivBase64 + value, key).toString();

  // 3. 构造 JSON 并 Base64 编码
  const payloadObj = {
    iv: ivBase64,
    value: value,
    mac: mac,
    tag: "", // AES-CBC 不需要 tag，但 Laravel 结构里有时会预留
  };

  return CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(JSON.stringify(payloadObj)),
  );
}
