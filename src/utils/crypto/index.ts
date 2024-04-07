import CryptoJS from 'crypto-js';

const CryptoSecret = '__CryptoJS_Secret__';

// /**
//  * 加密数据
//  * @param data - 数据
//  */
// export function encrypto(data: any) {
//   const newData = JSON.stringify(data);
//   return CryptoJS.AES.encrypt(newData, CryptoSecret).toString();
// }

// /**
//  * 解密数据
//  * @param cipherText - 密文
//  */
// export function decrypto(cipherText: string) {
//   const bytes = CryptoJS.AES.decrypt(cipherText, CryptoSecret);
//   const originalText = bytes.toString(CryptoJS.enc.Utf8);
//   if (originalText) {
//     return JSON.parse(originalText);
//   }
//   return null;
// }

/**
 * 加密数据 对应后端的加密
 * @param plainText - 数据
 */
export function encrypto(plainText: any) {
	const key_str = "9zeKW+Drdz56odzogAGQcQ==";
	const key = CryptoJS.enc.Base64.parse(key_str).words;
	const iv = CryptoJS.lib.WordArray.random(16);
	const newPlainText = JSON.stringify(plainText);
	const encrypted = CryptoJS.AES.encrypt(newPlainText, CryptoJS.lib.WordArray.create(key), { iv: iv });
	const combined = CryptoJS.lib.WordArray.create(iv.words.concat(encrypted.ciphertext.words));
	return CryptoJS.enc.Base64.stringify(combined);
}

/**
 * 解密数据 对应后端的解密
 * @param cipherText - 密文
 */
export function decrypto(cipherText: string) {
	const key_str = "9zeKW+Drdz56odzogAGQcQ==";
	const key = CryptoJS.enc.Base64.parse(key_str).words;
	const data = CryptoJS.enc.Base64.parse(cipherText);
	const iv = CryptoJS.lib.WordArray.create(data.words.slice(0, 4));
	const encrypted = CryptoJS.lib.WordArray.create(data.words.slice(4));
	const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, CryptoJS.lib.WordArray.create(key), { iv: iv });
	const originalText = decrypted.toString(CryptoJS.enc.Utf8);
	if (originalText) {
    return JSON.parse(originalText);
  }
  return null;
}

