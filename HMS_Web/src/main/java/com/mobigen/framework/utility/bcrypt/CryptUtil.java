package com.mobigen.framework.utility.bcrypt;

import java.security.MessageDigest;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;
import org.springframework.security.crypto.bcrypt.BCrypt;

/**
 * 
* <pre>
* <p> Title: BCryptEncrytion.java </p>
* <p> Description: BCrypt 해쉬 알고리즘을 사용한 비밀번호 암호화 Util 클래스</p>
* </pre>
*
* @author CheolJong Park
* @created: 2016.10
* @modified:
 *
 */
public class CryptUtil  {
	
	/**
	 * Hash a password using the OpenBSD bcrypt scheme
	 * @param password	the password to hash
	 * @return	the hashed password
	 */
	public static String hashpw(String password) {
		return BCrypt.hashpw(password, BCrypt.gensalt());
	}
	
	/**
	 * Hash a password using the OpenBSD bcrypt scheme
	 * @param password	the password to hash
	 * @param salt	the salt to hash with (perhaps generated using BCrypt.gensalt) (10 ~ 30) 
	 * @return	the hashed password
	 */
	public static String hashpw(String password, int salt) {
		return BCrypt.hashpw(password, BCrypt.gensalt(salt));
	}

	/**
	 * Check that a plaintext password matches a previously hashed one
	 * @param password	the plaintext password to verify
	 * @param passwordHashed	the previously-hashed password
	 * @return	true if the passwords match, false otherwise
	 */
	public static boolean checkpw(String password, String passwordHashed) {
		boolean isValidPassword = BCrypt.checkpw(password, passwordHashed);	
		return isValidPassword;
	}
	
	
	/**
	 * 메시지를 BASE64 알고리즘으로 인코딩한다.
	 * 
	 * @param message 원본메시지
	 * @return 인코딩된 문자열
	 */
	public static String encodeBase64(String message) {
		return new String(Base64.encodeBase64(message.getBytes()));
	}

	/**
	 * 메시지를 BASE64 알고리즘으로 디코딩한다.
	 * 
	 * @param message 원본 메시지
	 * @return 디코딩된 문자열
	 */
	public static String decodeBase64(String message) {
		return new String(Base64.decodeBase64(message.getBytes()));
	}

	
	
	/**
	 * 메시지를 MD5 알고리즘으로 해쉬한다.
	 * 
	 * @param message 원본메시지
	 * @return 해쉬된 문자열
	 */
	public static String hashMD5(String message) {
		return hash(message, "MD5");
	}

	public static String hashMD5(String message, String salt) {
		return hash(message, salt, "MD5");
	}

	/**
	 * 메시지를 SHA-1 알고리즘으로 해쉬한다.
	 * 
	 * @param message 원본메시지
	 * @return 해쉬된 문자열
	 */
	public static String hashSHA1(String message) {
		return hash(message, "SHA-1");
	}

	public static String hashSHA1(String message, String salt) {
		return hash(message, salt, "SHA-1");
	}

	/**
	 * 메시지를 SHA-256 알고리즘으로 해쉬한다.
	 * 
	 * @param message 원본메시지
	 * @return 해쉬된 문자열
	 */
	public static String hashSHA256(String message) {
		return hash(message, "SHA-256");
	}

	public static String hashSHA256(String message, String salt) {
		return hash(message, salt, "SHA-256");
	}

	/**
	 * 메시지를 SHA-512 알고리즘으로 해쉬한다.
	 * 
	 * @param message 원본메시지
	 * @return 해쉬된 문자열
	 */
	public static String hashSHA512(String message) {
		return hash(message, "SHA-512");
	}

	public static String hashSHA512(String message, String salt) {
		return hash(message, salt, "SHA-512");
	}

	/**
	 * 메시지를 개인키를 이용하여 AES 알고리즘으로 암호화한다.
	 * 
	 * @param message 원본메시지
	 * @param privateKey 개인키 
	 * @return 암호화된 문자열
	 */
	public static String encryptAES(String message, String privateKey) {
		try {
			SecretKeySpec skeySpec = new SecretKeySpec(privateKey.getBytes(), "AES");
			Cipher cipher = Cipher.getInstance("AES");
			cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
			return String.valueOf(Hex.encodeHex(cipher.doFinal(message.getBytes())));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 메시지를 개인키를 이용하여 AES 알고리즘으로 복호화한다.
	 *  
	 * @param message 원본메시지
	 * @param privateKey 개인키 
	 * @return 복호화된 문자열
	 */
	public static String decryptAES(String message, String privateKey) {
		try {
			SecretKeySpec skeySpec = new SecretKeySpec(privateKey.getBytes(), "AES");
			Cipher cipher = Cipher.getInstance("AES");
			cipher.init(Cipher.DECRYPT_MODE, skeySpec);
			return new String(cipher.doFinal(Hex.decodeHex(message.toCharArray())));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 메시지를 개인키를 이용하여 DES 알고리즘으로 암호화한다.
	 * 
	 * @param message 원본메시지
	 * @param privateKey 개인키 
	 * @return 암호화된 문자열
	 */
	public static String encryptDES(String message, String privateKey) {
		try {
			SecretKeySpec skeySpec = new SecretKeySpec(privateKey.getBytes(), "DES");
			Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
			cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
			return String.valueOf(Hex.encodeHex(cipher.doFinal(message.getBytes())));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 메시지를 개인키를 이용하여 DES 알고리즘으로 복호화한다.
	 *  
	 * @param message 원본메시지
	 * @param privateKey 개인키 
	 * @return 복호화된 문자열
	 */
	public static String decryptDES(String message, String privateKey) {
		try {
			SecretKeySpec skeySpec = new SecretKeySpec(privateKey.getBytes(), "DES");
			Cipher cipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
			cipher.init(Cipher.DECRYPT_MODE, skeySpec);
			return new String(cipher.doFinal(Hex.decodeHex(message.toCharArray())));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 해시알고리즘에서 사용하기 위한 솔트를 생성한다.
	 * 
	 * @return 랜덤으로 생성된 20자리 솔트 문자열
	 */
	public static String randomSalt() {
		SecureRandom r = new SecureRandom();
		byte[] salt = new byte[10];
		r.nextBytes(salt);
		return new String(Hex.encodeHex(salt));
	}

	//////////////////////////////////////////////////////////////////////////////////////////Private 메소드

	/**
	 * 메시지를 주어진 알고리즘으로 해쉬한다.
	 * 
	 * @param message 원본메시지
	 * @param algorithm 해쉬 알고리즘
	 * @return 해쉬된 문자열
	 */
	private static String hash(String message, String algorithm) {
		try {
			MessageDigest md = MessageDigest.getInstance(algorithm);
			md.reset();
			return new String(Hex.encodeHex(md.digest(message.getBytes())));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 메시지를 솔트를 사용하여 주어진 알고리즘으로 해쉬한다.
	 * 
	 * @param message 원본메시지
	 * @param salt 솔트값 
	 * @param algorithm 해쉬 알고리즘
	 * @return 해쉬된 문자열
	 */
	private static String hash(String message, String salt, String algorithm) {
		try {
			MessageDigest md = MessageDigest.getInstance(algorithm);
			md.reset();
			md.update(salt.getBytes());
			return new String(Hex.encodeHex(md.digest(message.getBytes())));
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
