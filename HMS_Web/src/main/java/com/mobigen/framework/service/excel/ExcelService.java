package com.mobigen.framework.service.excel;

import java.net.URLDecoder;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobigen.framework.service.excel.model.ExcelRequest;

@Service
public class ExcelService {

	@Autowired
	private SqlSessionTemplate sqlSessionTemplate;
	@SuppressWarnings("unchecked")
	public XSSFWorkbook makeExcel(ExcelRequest parameter) throws Exception {
        List<Object> excelData = (List<Object>) sqlSessionTemplate.selectList(parameter.getQueryId(), parameter.getParameter());
        if (excelData == null)
        	return null;

		XSSFWorkbook xswk = new XSSFWorkbook();
		XSSFFont headerFont = getDefaultFont(xswk, "Arial", true);
		XSSFFont cellFont = getDefaultFont(xswk, "굴림", false);
		CellStyle headerStyle = getDefaultCellStyle(xswk, headerFont, HSSFColor.GREY_25_PERCENT.index);
        CellStyle cellStyle =  getDefaultCellStyle(xswk, cellFont, HSSFColor.WHITE.index);

        XSSFSheet xss = xswk.createSheet();
        xswk.setSheetName(0, parameter.getFileName());

        XSSFRow row = null;
        XSSFCell cell = null;

        List<Map<String, String>> headers = parameter.getHeaders();

        int l = excelData.size();
        for (int i = 0; i < l; i++) {
        	row = xss.createRow(0);

        	int hl = headers.size();
        	for (int j = 0; j < hl; j++) {
				cell = row.createCell(j);
				cell.setCellValue(URLDecoder.decode(headers.get(j).get("headerName"),"utf-8"));
				cell.setCellStyle(headerStyle);
        	}

        	Map<String, String> excelObj = BeanUtils.describe(excelData.get(i));
        	row = xss.createRow(i+1);

        	for (int x = 0; x < hl; x++) {
        		if(!excelObj.containsKey(headers.get(x).get("fieldName")))
        			continue;

        		cell = row.createCell(x);
        		String data = excelObj.get(headers.get(x).get("fieldName"));
        		String dataType = headers.get(x).get("dataType");

        		if(dataType == null || "-".equals(data)) {
        			cell.setCellValue(data);
        		} else {
        			if("number".equals(dataType)) {
        				cell.setCellType(XSSFCell.CELL_TYPE_NUMERIC);
        				cell.setCellValue(new Double(data));
        			} else if("string".equals(dataType)) {
        				cell.setCellType(XSSFCell.CELL_TYPE_STRING);
        				cell.setCellValue(data);
        			} else {
        				cell.setCellType(XSSFCell.CELL_TYPE_BLANK);
        				cell.setCellValue(data);
        			}
        		}
        		cell.setCellStyle(cellStyle);
        	}
        }

		return xswk;
	}
	
	
	@SuppressWarnings("unchecked")
	public XSSFWorkbook makeExcelData(ExcelRequest parameter, List<Object> excelData) throws Exception {
		
		if (excelData == null)
			return null;
		
		XSSFWorkbook xswk = new XSSFWorkbook();
		XSSFFont headerFont = getDefaultFont(xswk, "Arial", true);
		XSSFFont cellFont = getDefaultFont(xswk, "굴림", false);
		CellStyle headerStyle = getDefaultCellStyle(xswk, headerFont, HSSFColor.GREY_25_PERCENT.index);
		CellStyle cellStyle =  getDefaultCellStyle(xswk, cellFont, HSSFColor.WHITE.index);
		
		XSSFSheet xss = xswk.createSheet();
		xswk.setSheetName(0, parameter.getFileName());
		
		XSSFRow row = null;
		XSSFCell cell = null;
		
		List<Map<String, String>> headers = parameter.getHeaders();
		
		int l = excelData.size();
		for (int i = 0; i < l; i++) {
			row = xss.createRow(0);
			
			int hl = headers.size();
			for (int j = 0; j < hl; j++) {
				cell = row.createCell(j);
				cell.setCellValue(URLDecoder.decode(headers.get(j).get("headerName"),"utf-8"));
				cell.setCellStyle(headerStyle);
			}
			
			Map<String, String> excelObj = BeanUtils.describe(excelData.get(i));
			row = xss.createRow(i+1);
			
			for (int x = 0; x < hl; x++) {
				if(!excelObj.containsKey(headers.get(x).get("fieldName")))
					continue;
				
				cell = row.createCell(x);
				String data = excelObj.get(headers.get(x).get("fieldName"));
				String dataType = headers.get(x).get("dataType");
				
				if(dataType == null || "-".equals(data)) {
					cell.setCellValue(data);
				} else {
					if("number".equals(dataType)) {
						cell.setCellType(XSSFCell.CELL_TYPE_NUMERIC);
						cell.setCellValue(new Double(data));
					} else if("string".equals(dataType)) {
						cell.setCellType(XSSFCell.CELL_TYPE_STRING);
						cell.setCellValue(data);
					} else {
						cell.setCellType(XSSFCell.CELL_TYPE_BLANK);
						cell.setCellValue(data);
					}
				}
				cell.setCellStyle(cellStyle);
			}
			
			 //Auto size all the columns
		    for (int x = 0; x < xss.getRow(0).getPhysicalNumberOfCells(); x++) {
		    	xss.autoSizeColumn(x);
		    	if (xss.getColumnWidth(x) == 0) {
	    	      // autosize failed use MIN_WIDTH
		    		xss.setColumnWidth(x, 100);
	    	    }
		    }

		}
		
		return xswk;
	}

	@SuppressWarnings("unchecked")
	public HSSFWorkbook makeExcelDataHSSF(ExcelRequest parameter, List<Object> excelData) throws Exception {
		
		if (excelData == null)
			return null;
		
		HSSFWorkbook hswk = new HSSFWorkbook();
		HSSFSheet hss = hswk.createSheet("new sheet");
		
		HSSFFont headerFont = getDefaultFont(hswk, "Arial", true);
		HSSFFont cellFont = getDefaultFont(hswk, "굴림", false);
		CellStyle headerStyle = getDefaultCellStyle(hswk, headerFont, HSSFColor.GREY_25_PERCENT.index);
		CellStyle cellStyle =  getDefaultCellStyle(hswk, cellFont, HSSFColor.WHITE.index);
		
		hswk.setSheetName(0, parameter.getFileName());
		
		HSSFRow row = null;
		HSSFCell cell = null;
		
		List<Map<String, String>> headers = parameter.getHeaders();
		
		int l = excelData.size();
		for (int i = 0; i < l; i++) {
			row = hss.createRow(0);
			
			int hl = headers.size();
			for (int j = 0; j < hl; j++) {
				cell = row.createCell(j);
				cell.setCellValue(URLDecoder.decode(headers.get(j).get("headerName"),"utf-8"));
				cell.setCellStyle(headerStyle);
			}
			
			Map<String, String> excelObj = BeanUtils.describe(excelData.get(i));
			row = hss.createRow(i+1);
			
			for (int x = 0; x < hl; x++) {
				if(!excelObj.containsKey(headers.get(x).get("fieldName")))
					continue;
				
				cell = row.createCell(x);
				String data = excelObj.get(headers.get(x).get("fieldName"));
				String dataType = headers.get(x).get("dataType");
				
				if(dataType == null || "-".equals(data)) {
					cell.setCellValue(data);
				} else {
					if("number".equals(dataType)) {
						cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
						
						if(data != null && !data.equals("")){
							cell.setCellValue(new Double(data));
						}else{
							cell.setCellValue("");
						}
						
					} else if("string".equals(dataType)) {
						cell.setCellType(HSSFCell.CELL_TYPE_STRING);
						cell.setCellValue(data);
					} else {
						cell.setCellType(HSSFCell.CELL_TYPE_BLANK);
						cell.setCellValue(data);
					}
				}
				cell.setCellStyle(cellStyle);
			}
			
			 //Auto size all the columns  //현진 성능상의 이유로 제거
//		    for (int x = 0; x < hss.getRow(0).getPhysicalNumberOfCells(); x++) {
//		    	hss.autoSizeColumn(x);
//		    	if (hss.getColumnWidth(x) == 0) {
//	    	      // autosize failed use MIN_WIDTH
//		    		hss.setColumnWidth(x, 100);
//	    	    }
//		    }
		}
		
		return hswk;
	}
	
//	private void printExecuteTime(long startTime) {
//        long endTime = System.currentTimeMillis();
//        // 시간 출력
//        System.out.println("##  소요시간(초.0f) : " + ( endTime - startTime )/1000.0f +"초"); 
//	}
	
	private XSSFFont getDefaultFont(XSSFWorkbook xswk, String fontName, Boolean bold) {
		XSSFFont font =  xswk.createFont();
		font.setFontHeightInPoints ((short) 10);
		font.setFontName (fontName);
		font.setBold(bold);
		return font;
	}
	
	private HSSFFont getDefaultFont(HSSFWorkbook hswk, String fontName, Boolean bold) {
		HSSFFont font =  hswk.createFont();
		font.setFontHeightInPoints ((short) 10);
		font.setFontName (fontName);
		font.setBold(bold);
		return font;
	}

	private CellStyle getDefaultCellStyle(XSSFWorkbook xswk, XSSFFont font, short backgroundStyle) {
		CellStyle cellStyle = xswk.createCellStyle();
		cellStyle.setAlignment (CellStyle.ALIGN_CENTER);
		cellStyle.setVerticalAlignment (CellStyle.VERTICAL_CENTER);
		cellStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		cellStyle.setBorderRight(XSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderLeft(XSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderTop(XSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderBottom(XSSFCellStyle.BORDER_THIN);
		cellStyle.setFillForegroundColor(backgroundStyle);
		cellStyle.setFont (font);
		return cellStyle;
	}
	
	private CellStyle getDefaultCellStyle(HSSFWorkbook hswk, HSSFFont font, short backgroundStyle) {
		CellStyle cellStyle = hswk.createCellStyle();
		cellStyle.setAlignment (CellStyle.ALIGN_CENTER);
		cellStyle.setVerticalAlignment (CellStyle.VERTICAL_CENTER);
		cellStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		cellStyle.setBorderRight(XSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderLeft(XSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderTop(XSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderBottom(XSSFCellStyle.BORDER_THIN);
		cellStyle.setFillForegroundColor(backgroundStyle);
		cellStyle.setFont (font);
		return cellStyle;
	}
	
}
