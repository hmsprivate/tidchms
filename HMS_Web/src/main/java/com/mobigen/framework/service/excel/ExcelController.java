package com.mobigen.framework.service.excel;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mobigen.framework.service.excel.model.ExcelRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping(value = "/service/excel")
public class ExcelController {

	@Autowired
	private ExcelService excelService;

	@RequestMapping(value = "/excelDownload.do")
	public void excelDownload(@ModelAttribute ExcelRequest parameter,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		XSSFWorkbook xswk = null;
		ServletOutputStream out = null;

		try {
			xswk = excelService.makeExcel(parameter);
			response.reset();

			String strClient = request.getHeader("User-Agent");
			if (strClient.indexOf("MSIE 5.5") > -1) {
				response.setHeader("Content-Disposition", "filename=" + parameter.getFileName() + ";");
			} else {
				response.setContentType("application/vnd.ms-excel");
				response.setHeader("Content-Disposition", "attachment; filename=" + parameter.getFileName() + ";");
			}

			out = response.getOutputStream();
			xswk.write(out);

		} catch (Exception e) {
			e.printStackTrace();
			log.error("Excel-File Download Error", e);
		} finally {
			if (xswk != null)
				xswk.close();

			if (out != null)
				out.close();
		}
		
	}
}
