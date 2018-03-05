package com.skt.hms.common;

import com.mobigen.framework.service.file.model.FileUploadRequest;
import com.mobigen.framework.service.file.model.FileUploadResponse;
import com.skt.hms.common.model.*;

import lombok.extern.slf4j.Slf4j;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.apache.http.entity.mime.MultipartEntity;
/*import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;*/
import org.apache.http.entity.mime.content.InputStreamBody;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@Slf4j
@Controller
public class CommonController {

	@Autowired
	CommonService commonService;
	
	@Autowired
	MessageSource messageSource;
	
	
	@SuppressWarnings("unused")
	private String errorCode = null;
	
	@SuppressWarnings("unused")
	private String errorMsg = null;
	
	/*@Autowired
	private ExcelService excelService;*/

	
	class HttpDeleteWithBody extends HttpEntityEnclosingRequestBase {
	    public static final String METHOD_NAME = "DELETE";

	    public String getMethod() {
	        return METHOD_NAME;
	    }

	    public HttpDeleteWithBody(final String uri) {
	        super();
	        setURI(URI.create(uri));
	    }

	    public HttpDeleteWithBody(final URI uri) {
	        super();
	        setURI(uri);
	    }

	    public HttpDeleteWithBody() {
	        super();
	    }
	}

	
	
	/**
	 * rest api get type
	 * @param restApiModel
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	public StringBuilder getRestApiInfo(@RequestBody RestApiModel restApiModel) throws Exception {
		String output;
		StringBuilder sb = new StringBuilder();
		
		int timeout = 5;
		RequestConfig config = RequestConfig.custom()
												  .setConnectTimeout(timeout * 3000)
												  .setConnectionRequestTimeout(timeout * 3000)
												  .setSocketTimeout(timeout * 3000).build();
		
		HttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();

		HttpGet getRequest = null;
		log.info("###api call= " + "http://"+ restApiModel.getIp() + restApiModel.getApiType());
		//getRequest = new HttpGet("http://211.214.168.102:8181" + restApiModel.getApiType());
		getRequest = new HttpGet("http://"+ restApiModel.getIp() + restApiModel.getApiType());	//TODO: 개발서버 반영시 변경
		
		getRequest.addHeader("accept", "application/json");

		HttpResponse response = httpClient.execute(getRequest);
		
		log.info("### " + response);
		
		BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
		
		while ((output = br.readLine()) != null) {
			sb.append(output);
		}
		
		if (response.getStatusLine().getStatusCode() != 200) {
			JSONObject responseErrorMsg = new JSONObject(sb.toString());
			errorCode = responseErrorMsg.getJSONObject("meta").get("code").toString();
			errorMsg = responseErrorMsg.getJSONObject("meta").get("message").toString();
			
			throw new RuntimeException("Failed : HTTP error code : " + errorCode + " : " + errorMsg);
		}
    	
    	return sb;
	}
	
	
	/**
	 * rest api post type
	 * @param restApiModel
	 * @param entity
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	public StringBuilder postRestApiInfo(@RequestBody RestApiModel restApiModel, StringEntity entity) throws Exception {
		String output;
		StringBuilder sb = new StringBuilder();
		
		int timeout = 5;
		RequestConfig config = RequestConfig.custom()
												  .setConnectTimeout(timeout * 3000)
												  .setConnectionRequestTimeout(timeout * 3000)
												  .setSocketTimeout(timeout * 3000).build();
		
		HttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();
		
		HttpPost getRequest = null;
		log.info("###api call= " + "http://"+ restApiModel.getIp() + restApiModel.getApiType());
		//getRequest = new HttpPost("http://211.214.168.102:8181" + restApiModel.getApiType());
		getRequest = new HttpPost("http://"+ restApiModel.getIp() + restApiModel.getApiType());	//TODO: 개발서버 반영시 변경

		getRequest.addHeader("accept", "application/json");
		getRequest.setEntity(entity);

		HttpResponse response = httpClient.execute(getRequest);
		
		log.info("### " + response);
		
		BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
		
		while ((output = br.readLine()) != null) {
			sb.append(output);
		}
		
		if (response.getStatusLine().getStatusCode() == 400 || response.getStatusLine().getStatusCode() == 200 || response.getStatusLine().getStatusCode() == 201) {
		}else{
			JSONObject responseErrorMsg = new JSONObject(sb.toString());
			errorCode = responseErrorMsg.getJSONObject("meta").get("code").toString();
			errorMsg = responseErrorMsg.getJSONObject("meta").get("message").toString();
			
			throw new RuntimeException("Failed : HTTP error code : " + errorCode + " : " + errorMsg);
		}
    	
    	return sb;
	}
	
	
	/**
	 * rest api post type(multipart/form-data)
	 * @param restApiModel
	 * @param entity
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	public StringBuilder postRestApiInfo(@RequestBody RestApiModel restApiModel, File inFile) throws Exception {
		String output;
		StringBuilder sb = new StringBuilder();
		FileInputStream fis = null;
		
		int timeout = 5;
		RequestConfig config = RequestConfig.custom()
												  .setConnectTimeout(timeout * 5000)
												  .setConnectionRequestTimeout(timeout * 5000)
												  .setSocketTimeout(timeout * 5000).build();
		
		HttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();
		
		fis = new FileInputStream(inFile);
		HttpPost getRequest = null;
		log.info("###api call= " + "http://"+ restApiModel.getIp() + restApiModel.getApiType());
		//getRequest = new HttpPost("http://211.214.168.102:8181" + restApiModel.getApiType());
		getRequest = new HttpPost("http://"+ restApiModel.getIp() + restApiModel.getApiType());	//TODO: 개발서버 반영시 변경
		
		MultipartEntity entity = new MultipartEntity();
		entity.addPart("file", new InputStreamBody(fis, inFile.getName()));

		getRequest.addHeader("accept", "multipart/form-data");
		getRequest.setEntity(entity);

		HttpResponse response = httpClient.execute(getRequest);
		
		log.info("### " + response);
		
		BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
		
		while ((output = br.readLine()) != null) {
			sb.append(output);
		}
		
		if(response.getStatusLine().getStatusCode() == 201 || response.getStatusLine().getStatusCode() == 200){
		}else{
			JSONObject responseErrorMsg = new JSONObject(sb.toString());
			errorCode = responseErrorMsg.getJSONObject("meta").get("code").toString();
			errorMsg = responseErrorMsg.getJSONObject("meta").get("message").toString();
			
			throw new RuntimeException("Failed : HTTP error code : " + errorCode + " : " + errorMsg);
		}
    	
    	return sb;
	}
	
	/**
	 * rest api delete type
	 * @param restApiModel
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	public StringBuilder deleteRestApiInfo(@RequestBody RestApiModel restApiModel) throws Exception {
		String output;
		StringBuilder sb = new StringBuilder();
		
		int timeout = 5;
		RequestConfig config = RequestConfig.custom()
												  .setConnectTimeout(timeout * 3000)
												  .setConnectionRequestTimeout(timeout * 3000)
												  .setSocketTimeout(timeout * 3000).build();
		
		HttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();

		HttpDelete getRequest = null;
		log.info("###api call= " + "http://"+ restApiModel.getIp() + restApiModel.getApiType());
		//getRequest = new HttpDelete("http://211.214.168.102:8181" + restApiModel.getApiType());
		getRequest = new HttpDelete("http://"+ restApiModel.getIp() + restApiModel.getApiType());	//TODO: 개발서버 반영시 변경
		
		getRequest.addHeader("accept", "application/json");

		HttpResponse response = httpClient.execute(getRequest);
		
		log.info("### " + response);
		
		BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
		
		while ((output = br.readLine()) != null) {
			sb.append(output);
		}
		
		if (response.getStatusLine().getStatusCode() != 200) {
			JSONObject responseErrorMsg = new JSONObject(sb.toString());
			errorCode = responseErrorMsg.getJSONObject("meta").get("code").toString();
			errorMsg = responseErrorMsg.getJSONObject("meta").get("message").toString();
			
			throw new RuntimeException("Failed : HTTP error code : " + errorCode + " : " + errorMsg);
		}
    	
    	return sb;
	}


	/**
	 * rest api delete type
	 * (body parameter add version)
	 * @param restApiModel
	 * @param entity
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	public Object deleteRestApiInfo(@RequestBody RestApiModel restApiModel, StringEntity entity) throws Exception {
		String output;
		StringBuilder sb = new StringBuilder();
		
		int timeout = 5;
		RequestConfig config = RequestConfig.custom()
												  .setConnectTimeout(timeout * 3000)
												  .setConnectionRequestTimeout(timeout * 3000)
												  .setSocketTimeout(timeout * 3000).build();
		
		HttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();

		HttpDeleteWithBody getRequest = null;
		log.info("###api call= " + "http://"+ restApiModel.getIp() + restApiModel.getApiType());
		//getRequest = new HttpDeleteWithBody("http://211.214.168.102:8181" + restApiModel.getApiType());
		getRequest = new HttpDeleteWithBody("http://"+ restApiModel.getIp() + restApiModel.getApiType());	//TODO: 개발서버 반영시 변경
		
		getRequest.addHeader("accept", "application/json");
		getRequest.setEntity(entity);

		HttpResponse response = httpClient.execute(getRequest);
		
		log.info("### " + response);
		

		BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
		
		while ((output = br.readLine()) != null) {
			sb.append(output);
		}
		
		
		if (response.getStatusLine().getStatusCode() != 200) {
			JSONObject responseErrorMsg = new JSONObject(sb.toString());
			errorCode = responseErrorMsg.getJSONObject("meta").get("code").toString();
			errorMsg = responseErrorMsg.getJSONObject("meta").get("message").toString();
			
			throw new RuntimeException("Failed : HTTP error code : " + errorCode + " : " + errorMsg);
		}
    	
    	return sb;
	}
	
	
	
	/**
	 * rest api put type
	 * @param restApiModel
	 * @param entity
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	public Object putRestApiInfo(@RequestBody RestApiModel restApiModel, StringEntity entity) throws Exception {
		String output;
		StringBuilder sb = new StringBuilder();
		
		int timeout = 5;
		RequestConfig config = RequestConfig.custom()
												  .setConnectTimeout(timeout * 3000)
												  .setConnectionRequestTimeout(timeout * 3000)
												  .setSocketTimeout(timeout * 3000).build();
		
		HttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();

		HttpPut getRequest = null;
		log.info("###api call= " + "http://"+ restApiModel.getIp() + restApiModel.getApiType());
		//getRequest = new HttpPut("http://211.214.168.102:8181" + restApiModel.getApiType());
		getRequest = new HttpPut("http://"+ restApiModel.getIp() + restApiModel.getApiType());	//TODO: 개발서버 반영시 변경
		
		getRequest.addHeader("accept", "application/json");
		getRequest.setEntity(entity);

		HttpResponse response = httpClient.execute(getRequest);
		
		log.info("### " + response);
		
		BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
		
		while ((output = br.readLine()) != null) {
			sb.append(output);
		}
		
		if (response.getStatusLine().getStatusCode() != 200) {
			JSONObject responseErrorMsg = new JSONObject(sb.toString());
			errorCode = responseErrorMsg.getJSONObject("meta").get("code").toString();
			errorMsg = responseErrorMsg.getJSONObject("meta").get("message").toString();
			
			throw new RuntimeException("Failed : HTTP error code : " + errorCode + " : " + errorMsg);
		}
    	
    	return sb;
	}
	
	
	/**
	 * 파일 업로드
	 * @param uploadForm
	 * @return
	 * @throws Exception
	 */
	public List<FileUploadResponse> fileUpload(FileUploadRequest uploadForm) throws Exception
	{
		List<FileUploadResponse> result = new ArrayList<FileUploadResponse>();

        List<MultipartFile> files = uploadForm.getFile();
        if(null != files && files.size() > 0)
        {
            for (MultipartFile multipartFile : files)
            {
                String originalFileName = multipartFile.getOriginalFilename();
                //String extType = originalFileName.substring(originalFileName.indexOf("."), originalFileName.length());

                String saveFileName = originalFileName;
				String path = uploadForm.getUploadUrl() + saveFileName;

				File f = new File(path);
				multipartFile.transferTo(f);

				FileUploadResponse fure = new FileUploadResponse(originalFileName, saveFileName, uploadForm.getType());
				result.add(fure);
            }
        }
		return result;
	}
	
	
	/**
	 * O&M Snap post Rest Api Call(Sync)
	 * @param restApiModel
	 * @param entity
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	public StringBuilder postOnMRestApiInfo(@RequestBody RestApiModel restApiModel, StringEntity entity) throws Exception {
		String output;
		StringBuilder sb = new StringBuilder();
		
		int timeout = 5;
		RequestConfig config = RequestConfig.custom()
												  .setConnectTimeout(timeout * 3000)
												  .setConnectionRequestTimeout(timeout * 3000)
												  .setSocketTimeout(timeout * 3000).build();
		
		HttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();
		
		HttpPost getRequest = null;
		log.info("###sync api call= " + "http://"+ restApiModel.getSyncIp());
		//getRequest = new HttpPost("http://211.214.168.102:18181" + restApiModel.getApiType());
		getRequest = new HttpPost("http://"+ restApiModel.getSyncIp());

		getRequest.addHeader("accept", "application/json");
		getRequest.setEntity(entity);

		HttpResponse response = httpClient.execute(getRequest);
		
		log.info("### " + response);
		
		BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
		
		if(response.getStatusLine().getStatusCode() == 200){
			while ((output = br.readLine()) != null) {
				sb.append(output);
			}
			
			errorMsg = sb.toString();
			
			if ( "completed".equals(errorMsg)) {
			}else{
				throw new RuntimeException("Failed : HTTP error message : " + errorMsg);
			}
		}
    	return sb;
	}
	
	
	/**
	 * O&M Snap get Rest Api Call(Task excute Sync)
	 * @param restApiModel
	 * @param entity
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	public StringBuilder getOnMRestApiInfo(@RequestBody RestApiModel restApiModel) throws Exception {
		String output;
		StringBuilder sb = new StringBuilder();
		
		int timeout = 5;
		RequestConfig config = RequestConfig.custom()
												  .setConnectTimeout(timeout * 3000)
												  .setConnectionRequestTimeout(timeout * 3000)
												  .setSocketTimeout(timeout * 3000).build();
		
		HttpClient httpClient = HttpClientBuilder.create().setDefaultRequestConfig(config).build();

		HttpGet getRequest = null;
		log.info("###api call= " + "http://"+ restApiModel.getSyncIp() + restApiModel.getApiType());

		getRequest = new HttpGet("http://"+ restApiModel.getSyncIp() + restApiModel.getApiType());
		
		getRequest.addHeader("accept", "application/json");

		HttpResponse response = httpClient.execute(getRequest);
		
		log.info("### " + response);
		
		BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));
		
		while ((output = br.readLine()) != null) {
			sb.append(output);
		}
		
		if (response.getStatusLine().getStatusCode() == 200) {
			JSONObject responseErrorMsg = new JSONObject(sb.toString());
			errorCode = responseErrorMsg.get("resultStatus").toString();
			errorMsg = responseErrorMsg.get("resultMessage").toString();
			
			if ( "Completed".equals(errorCode)) {
			}else{
				throw new RuntimeException("Failed : HTTP error message : " + errorMsg);
			}
		}
    	return sb;
	}

	
	
	/**
	 * Excel Header 정보를 생성해준다.
	 * headerName, fileName, dataType 정보의 개수를 일치시켜준다.
	 * 
	 * headerName 은 실제 엑셀에서 보여지는 컬럼명
	 * fieldName 은 쿼리구문의 컬럼명 한글이나, 중간공백 사용불가
	 * 
	 * @param headers 
	 * @param headerName
	 * @param fieldName
	 * @param dataType
	 */
	/*public List<Map<String, String>> makeExcelHeader(List<Map<String, String>> headers, String[] headerName, String[] fieldName, String[] dataType){
		
		if(headers != null){
			if(headerName != null && fieldName != null && dataType != null){
				Map<String, String> header = null;
				for(int i=0; i < headerName.length; i++){
					header = new HashMap<String, String>();
					header.put("headerName", headerName[i]);
					header.put("fieldName", fieldName[i]);
					header.put("dataType", dataType[i]);
					
					headers.add(header);
				}
			}			
		}
		return headers;
	}*/
	
	/**
	 * HSSFWorkbook
	 * 
	 * @param request
	 * @param response
	 * @param parameter
	 * @param excelDataObjList
	 * @param fileType
	 * @param headerCSV
	 * @throws Exception
	 */
	/*public void makeHSSFExcelCSV(HttpServletRequest request, HttpServletResponse response, ExcelRequest excelRequest, List<Object> excelDataObjList, String fileType, String [] headerName, String[] headerCSV) throws Exception{
		
		if(fileType == null){
			fileType = "excel";
		}
		
		String strClient = request.getHeader("User-Agent");
		if (strClient.indexOf("MSIE 5.5") > -1) {
			response.setHeader("Content-Disposition", "filename=" + excelRequest.getFileName() + ";");
		} else if(fileType.equals("csv")){
			//response.setContentType("text/csv");
			response.setContentType("application/vnd.ms-excel:euc-kr");
			response.setHeader("Content-Disposition", "attachment; filename=" + excelRequest.getFileName() +".csv"+ ";");
			
			ICsvBeanWriter csvWriter = new CsvBeanWriter(new OutputStreamWriter(response.getOutputStream(), "euc-kr"), CsvPreference.STANDARD_PREFERENCE);
			
			//String str = excelRequest.getTitle();
 			//csvWriter.writeHeader(str);
			csvWriter.writeHeader(headerName);

			for (Object object : excelDataObjList) {
				csvWriter.write(object, headerCSV);
			}
			
			if (csvWriter != null){
				csvWriter.close();
			}
			
		} else{
			
			// XLS Writing
			HSSFWorkbook hswk = null;
			ServletOutputStream out = null;
			
			hswk = excelService.makeExcelDataHSSF(excelRequest, excelDataObjList);
			response.reset();

			response.setContentType("application/vnd.ms-excel:UTF-8");
			response.setHeader("Content-Disposition", "attachment; filename=" + excelRequest.getFileName() +".xls"+";");
			
			out = response.getOutputStream();
			hswk.write(out);
			
			if (hswk != null){
				hswk.close();
			}
			
			if (out != null){
				out.close();
			}
		}
	}*/
}
