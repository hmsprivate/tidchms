package com.skt.hms.common;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

public class JSONTypeHandler extends BaseTypeHandler<Object>{


	/**
	 * 저장 데이터 파싱
	 */
	@Override
	public void setNonNullParameter(PreparedStatement preparedStatement, int i, Object parameter, JdbcType jdbcType) throws SQLException {
		String p = JacksonParser.toString(parameter, "utf-8");
		preparedStatement.setObject(i, p);

	}

	@Override
	public Object getNullableResult(ResultSet resultSet, String columnName) throws SQLException {
		Object d = resultSet.getObject(columnName); if(d == null) return d;
		return JacksonParser.toMap(d.toString());
	}

	@Override
	public Object getNullableResult(ResultSet resultSet, int columnIndex) throws SQLException {
		Object d = resultSet.getObject(columnIndex); if(d == null) return d;
		return JacksonParser.toMap(d.toString());

	}

	@Override
	public Object getNullableResult(CallableStatement callableStatement, int columnIndex) throws SQLException {
		Object d = callableStatement.getObject(columnIndex); if(d == null) return d;
		return JacksonParser.toMap(d.toString());
	}

//	private String toString(Object object, String charset) {
//		ByteArrayOutputStream output = null;
//		Writer write = null;
//		String data = null;
//
//		try{
//			output = new ByteArrayOutputStream();
//			write = new OutputStreamWriter(output, charset);
//
//			ObjectMapper mapper = new ObjectMapper();
//			mapper.writeValue(write, object);
//			data = output.toString(charset);
//		} catch (IOException e) {
//			throw new RuntimeException(e.getMessage());
//		} finally {
//			if(output != null) try { output.close(); } catch (IOException e) { }
//			if(write != null) try { write.close(); } catch (IOException e) { }
//		}
//
//		return data;
//	}
//
//	private Map<String, Object> toMap(String json) {
//		Map<String, Object> result = null;
//		try {
//			ObjectMapper mapper = new ObjectMapper();
//			result = mapper.readValue(json, new TypeReference<Map<String, Object>>() {});
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//
//		return result;
//	}
}
