package com.skt.mobigen.hms.snapinfocollector.test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class InfluxTimeTest {
	
	public static void main(String[] args) throws ParseException {
		String time = "2017-08-22T10:43:24.671976525Z";
		SimpleDateFormat t_sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
		
		time = time.replaceAll("[a-zA-Z]", " ");
		
		Date parseDate = t_sdf.parse(time.substring(0,time.lastIndexOf(".")+4));
		
		long milliseconds = parseDate.getTime();
		
		System.out.println(sdf.format(milliseconds));
		
		
		
		
		
		
	}

}
