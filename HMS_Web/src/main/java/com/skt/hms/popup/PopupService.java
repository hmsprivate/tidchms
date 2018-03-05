package com.skt.hms.popup;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.skt.hms.agent.model.AgentStatusModel;
import com.skt.hms.main.model.MainModel;
import com.skt.hms.popup.model.PopupModel;
import com.skt.hms.popup.model.PopupSearchModel;


@Service
public class PopupService {

	@Autowired
	private PopupMapper popupMapper;


	/**
	 * Node 상세 정보 대분류 category 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getCategoryList(PopupSearchModel param) throws Exception {
		List<Map<String,Object>> resultModel = popupMapper.getCategoryList(param);
		return resultModel;
	}
	
	/**
	 * Node 상세 정보 중분류 category 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getCategoryList2(PopupSearchModel param) throws Exception {
		List<Map<String,Object>> resultModel = popupMapper.getCategoryList2(param);
		return resultModel;
	}
	
	
	/**
	 * Node 상세 정보 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getNodeDetailList(PopupSearchModel param) throws Exception{
		List<PopupModel> resultModel = popupMapper.getNodeDetailList(param);
		return resultModel;
	}


	/**
	 * plugin Popup 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getPluginPopupList(PopupSearchModel param) throws Exception{
		List<PopupModel> resultModel = popupMapper.getPluginPopupList(param);
		return resultModel;
	}
	
	/**
	 * task Popup 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getTaskPopupList(PopupSearchModel param) throws Exception{
		List<PopupModel> resultModel = popupMapper.getTaskPopupList(param);
		return resultModel;
	}
	
	/**
	 * node Popup 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getNodePopupList(PopupSearchModel param) throws Exception{
		return popupMapper.getNodePopupList(param);
	}
	
	/**
	 * node Popup 리스트 건수
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public int getNodePopupCount(PopupSearchModel param) throws Exception{
		return popupMapper.getNodePopupCount(param);
	}
	
	/**
	 * Group 정보 리스트 조회
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getGroupList() throws Exception {
		List<PopupModel> resultModel = popupMapper.getGroupList();
		return resultModel;
	}
	
	/**
	 * hms compare Popup 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getHmsCompareList(PopupSearchModel param) throws Exception{
		return popupMapper.getHmsCompareList(param);
	}
	
	/**
	 * cmdb compare Popup 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<Map<String,Object>> getCmdbCompareList(PopupSearchModel param) throws Exception{
		return popupMapper.getCmdbCompareList(param);
	}
	
	/**
	 * rest 호출 ip 기타 정보 조회
	 * @return
	 */
	public PopupModel getNodeInfo() {
		PopupModel resultModel = popupMapper.getNodeInfo();
		return resultModel;
	}
	
	
	/**
	 * Node history 상세 data time 정보 리스트 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getNodeHistoryDataTime(PopupSearchModel param) throws Exception{
		List<PopupModel> resultModel = popupMapper.getNodeHistoryDataTime(param);
		return resultModel;
	}
	
	
	/**
	 * Node history data time 정보의 비교 데이터 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> searchHistoryInfo(PopupSearchModel param) throws Exception{
		List<PopupModel> resultModel = popupMapper.searchHistoryInfo(param);
		return resultModel;
	}
	
	/**
	 * Task Status Per Node 상세 정보 조회
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public List<PopupModel> getTaskStatusNodeInfo(PopupSearchModel param) throws Exception{
		List<PopupModel> resultModel = popupMapper.selectTaskStatusNodeInfo(param);
		return resultModel;
	}
	
	
	/**
	 * node metric정보 변경 관리
	 * @param filter
	 * @return
	 * @throws Exception
	 */
	@Transactional
	public int updateChangeNode(PopupSearchModel filter) throws Exception{
		//node_seq로 데이터있으면 삭제
		popupMapper.deleteNodeChange(filter);
		
		//선택한것 한꺼번에 insert 작업
		List<String> tempDataList = new  ArrayList<String>();
		
		for(int i = 0; i < filter.getNodeMetricList().size(); i++) {
			String record = "(";
			String str = "";
			str = "\'" + filter.getNodeMetricList().get(i) + "\'";
			str += ", now(), ";
			str += "\'" + filter.getNodeSeq() + "\'";
			
			record += "" + str + ")";

			tempDataList.add(record);
		}
		filter.setDataList(tempDataList);
		
		//데이터 등록
		return popupMapper.insertNodeChange(filter);
	}
	
}
