package com.skt.hms.popup;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.skt.hms.agent.model.AgentStatusModel;
import com.skt.hms.main.model.MainModel;
import com.skt.hms.popup.model.PopupModel;
import com.skt.hms.popup.model.PopupSearchModel;


@Repository("PopupMapper")
public interface PopupMapper {
	
	
	/**
	 * Node 상세 정보 대분류 category 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getCategoryList(PopupSearchModel filter) throws Exception;
	
	/**
	 * Node 상세 정보 중분류 category 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getCategoryList2(PopupSearchModel filter) throws Exception;
	
	/**
	 * Node 상세 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getNodeDetailList(PopupSearchModel filter) throws Exception;

	
	/**
	 * plugin Popup 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getPluginPopupList(PopupSearchModel filter) throws Exception;
	
	/**
	 * task Popup 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getTaskPopupList(PopupSearchModel filter) throws Exception;
	
	
	/**
	 * node Popup 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getNodePopupList(PopupSearchModel filter) throws Exception;
	
	
	/**
	 * node Popup 리스트 건수
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public int getNodePopupCount(PopupSearchModel filter) throws Exception;
	
	
	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getGroupList() throws Exception;
	
	
	/**
	 * hms compare Popup 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getHmsCompareList(PopupSearchModel filter) throws Exception;
	
	/**
	 * cmdb compare Popup 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getCmdbCompareList(PopupSearchModel filter) throws Exception;
	
	/**
	 * rest 호출 ip 기타 정보 조회
	 * @return
	 */
	public PopupModel getNodeInfo();
	
	/**
	 * Node history 상세 data time 정보 리스트 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getNodeHistoryDataTime(PopupSearchModel filter) throws Exception;
	
	
	/**
	 * Node history data time 정보의 비교 데이터 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> searchHistoryInfo(PopupSearchModel filter) throws Exception;
	
	/**
	 * Task Status Per Node 상세 정보 조회
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> selectTaskStatusNodeInfo(PopupSearchModel filter) throws Exception;
	
	/**
	 * node metric정보 삭제
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public Integer deleteNodeChange(PopupSearchModel filter) throws Exception;
	
	/**
	 * node metric정보 등록
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	public Integer insertNodeChange(PopupSearchModel filter) throws Exception;
}
