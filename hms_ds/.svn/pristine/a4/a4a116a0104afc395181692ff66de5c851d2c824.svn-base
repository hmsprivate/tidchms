package com.skt.hms.utils;


import java.io.PrintWriter;
import java.io.StringWriter;
import java.security.MessageDigest;

public class Tools {

    public static String makeSHA1Hash(String input) {

        String hexStr = "";
        try {
            MessageDigest md = MessageDigest.getInstance("SHA1");
            md.reset();
            byte[] buffer = input.getBytes("UTF-8");
            md.update(buffer);
            byte[] digest = md.digest();


            for (int i = 0; i < digest.length; i++) {
                hexStr += Integer.toString((digest[i] & 0xff) + 0x100, 16).substring(1);
            }

        }catch (Exception e) {}

        return hexStr;
    }

    public static String getPrintStackTrace(Exception e) {

        StringWriter errors = new StringWriter();
        e.printStackTrace(new PrintWriter(errors));

        return errors.toString();

    }

    public static String printSize(String size) {
        String[] unit = {"KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"};

        Double input = Double.parseDouble(size);
        int bin = 1024;
        Double rslt = input;

        int pos = 0;
        while(true) {
            rslt = rslt/bin;
            if (rslt < bin) {
                break;
            }

            if(unit.length-1 == pos) break;
            pos += 1;
        }

        String result = String.format("%.2f", rslt);
        result += " "+unit[pos];

        return result ;
    }

    public static void main(String [] args){
        String rslt = Tools.printSize("8581701632");
        System.out.println(rslt);
    }
}
