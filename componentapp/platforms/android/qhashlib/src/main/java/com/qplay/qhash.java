package com.qplay;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import static com.sun.org.apache.xalan.internal.lib.ExsltDatetime.time;

public class qhash {
    public static String timeHash(String key) {
        try {
            String secret = key;
            String message = time();

            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            String hash = Base64.getEncoder(sha256_HMAC.doFinal(message.getBytes()));
            System.out.println(hash);

            return hash;
        }
        catch (Exception e){
            System.out.println("Error");
        }
    }
}
