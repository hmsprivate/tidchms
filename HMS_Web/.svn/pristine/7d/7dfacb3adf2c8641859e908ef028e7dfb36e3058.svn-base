package com.skt.hms.main;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.skt.hms.main.model.MainModel;
import com.skt.hms.main.model.MainSearchModel;

@Repository("MainMapper")
public interface MainMapper {
	
	/**
	 * dashBoard 조회
	 * @return
	 */
	public MainModel getDashBoardStatus();
	

	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	public List<MainModel> getGroupList() throws Exception;

	
	/**
	 * Node 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getNodeList(MainSearchModel filter) throws Exception;
	
	
	/**
	 * Node 리스트 건수
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public int getNodeCount(MainSearchModel filter) throws Exception;

}
