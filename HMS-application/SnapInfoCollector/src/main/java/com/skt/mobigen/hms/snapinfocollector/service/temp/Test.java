package com.skt.mobigen.hms.snapinfocollector.service.temp;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections4.ListUtils;

public class Test {
	
	public static void main(String[] args) {
		List<String> target_list = new ArrayList<>();
		
		for (int i =0 ; i < 100 ; i++) {
			target_list.add(String.valueOf(i));
		}
		
		System.out.println(target_list.size());
		
		
		
		List<List<String>> split_list = ListUtils.partition(target_list, 1000);
		
		
		
		System.out.println(split_list.size());
		
	}

}
