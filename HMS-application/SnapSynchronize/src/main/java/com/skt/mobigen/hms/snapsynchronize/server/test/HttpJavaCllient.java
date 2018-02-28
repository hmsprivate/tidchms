package com.skt.mobigen.hms.snapsynchronize.server.test;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import com.google.gson.Gson;

public class HttpJavaCllient {

	public static void main(String[] args) {
		try {
//			URL url = new URL("http://127.0.0.1:18181");
			URL url = new URL("http://211.214.168.102:18181");
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Accept-Language", "ko-kr,ko;q=0.8,en-us;q=0.5,en;q=0.3");

			Entity param = new Entity();
//			param.setNode_name("secure03");
//			param.setAgreement_name("grooup_name");
			param.setType("manager_plugin");
//			param.setType("manager_task");
//			param.setType("agreement_list");
//			param.setType("agreement_management");
//			param.setType("plugin");
//			param.setType("task");

			OutputStreamWriter osw = new OutputStreamWriter(conn.getOutputStream());
			
			System.out.println(new Gson().toJson(param));
			
			osw.write(new Gson().toJson(param));
			osw.flush();

			// 응답
			BufferedReader br = null;
			br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

			String line = null;
			System.out.println("------------------------------------------------");
			while ((line = br.readLine()) != null) {
				System.out.println(line);
			}
			System.out.println("------------------------------------------------");

			// 닫기
			osw.close();
			br.close();

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}

class Entity {
	private String node_name;
	private String agreement_name;
	private String type;

	public String getNode_name() {
		return node_name;
	}

	public void setNode_name(String node_name) {
		this.node_name = node_name;
	}

	public String getAgreement_name() {
		return agreement_name;
	}

	public void setAgreement_name(String agreement_name) {
		this.agreement_name = agreement_name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
